import copy, re
import torch
import numpy as np
import torch.nn as nn
import pandas as pd
from torch.utils.data import DataLoader
from utils.cnn_model import CNN, GradCamModel, ConLoss, NegEmbedding, save_model, load_model, GradAccess, AutoInt
from utils.dataloader import preprocessing, get_dataloader, preprocessing_uci, preprocessing_credit
from utils.sampling import neg_hard, neg_random, find_sim, find_sim_cos
from sklearn.preprocessing import MinMaxScaler
from sklearn.manifold import TSNE
from sklearn import metrics

cos = nn.CosineSimilarity()  # cos with dim=1， cos to col
cos0 = nn.CosineSimilarity(dim=0)  # cos with dim=0, cos to row
const_div = 1e10
# global variables
global_v = {}


def convert_to_float(x):
    if type(x) != str:
        x = float(x)
    return x


def rmse(pred, label):
    n = pred.shape[0]
    tmp = torch.sum((pred - label) ** 2) / n
    return tmp ** 0.5

def print_metrics(prob_all, label_all):
    if type(prob_all) is torch.Tensor:
        prob_all = prob_all.cpu().detach().numpy()
    if type(label_all) is torch.Tensor:
        label_all = label_all.cpu().detach().numpy()
    prob_idx = np.argmax(prob_all, axis=1)
    acc = metrics.accuracy_score(label_all, prob_idx)
    return 1-acc

def print_loss(prob_all, label_all):
    loss = ((prob_all-label_all)**2).mean() / const_div
    return loss

def scaler(x):
    maxt, mint = global_v['max'], global_v['min']
    if type(x) is torch.Tensor:
        maxt, mint = torch.FloatTensor(maxt).to(x.device), torch.FloatTensor(mint).to(x.device)
    return (x-mint)/(maxt-mint)


def pretrain(full_data, lr=3e-3, epoch=100, batch_size=64):
    print('pretrain....')
    full_loader = DataLoader(full_data,
                             batch_size=batch_size,
                             collate_fn=full_data.collate_fn,
                             shuffle=True)
    model = CNN(full_data.get_dim()).to('cuda')
    optimizer = torch.optim.Adam(model.parameters(), lr=lr)
    loss_func = nn.MSELoss()
    loss_list = []
    for epo in range(epoch):
        model.train()
        for data, label, semi, label_, _ in full_loader:
            data, label = data.to('cuda'), label.to('cuda')
            emb, output = model(data)
            loss = loss_func(output, label) / const_div
            loss_list.append(loss.detach().cpu().numpy())
            optimizer.zero_grad()
            loss.backward()
            optimizer.step()

    return model, optimizer

def pretrain_both(full_data, semi_dim, full_model, semi_model, lr=1e-2, epoch=100, batch_size=64,
                    val_data=None, weight_decay=0.01, loss_func=nn.MSELoss(), val_func=print_loss):
    print('pretrain....')
    full_loader = DataLoader(full_data,
                      batch_size=batch_size,
                      collate_fn=full_data.collate_fn,
                      shuffle=True)
    if val_data:
        val_full,  val_semi = val_data
        val_full_loader = DataLoader(val_full,
                                 batch_size=batch_size,
                                 collate_fn=val_full.collate_fn,
                                 shuffle=False)
        val_semi_loader = DataLoader(val_semi,
                                     batch_size=batch_size,
                                     collate_fn=val_semi.collate_fn,
                                     shuffle=False)
    full_opt = torch.optim.Adam(full_model.parameters(), lr=lr, weight_decay=weight_decay/100)
    full_loss_list, full_val_loss_list = [], []
    full_best_loss = 100
    full_model.train()

    semi_opt = torch.optim.Adam(semi_model.parameters(), lr=lr, weight_decay=weight_decay)
    semi_loss_list, semi_val_loss_list = [], []
    semi_best_loss = 100
    semi_model.train()

    # loss_func = nn.MSELoss()
    for epo in range(epoch):
        for full_data, full_label, semi_data, semi_label, coeff in full_loader:
            full_emb, full_output = full_model(full_data)
            full_loss = loss_func(full_output, full_label)/const_div
            full_loss_list.append(full_loss.clone().detach().cpu().numpy())
            full_opt.zero_grad()
            full_loss.backward()
            full_opt.step()

            semi_emb, semi_output = semi_model(semi_data)
            semi_loss = loss_func(semi_output, semi_label) / const_div
            semi_loss_list.append(semi_loss.clone().detach().cpu().numpy())
            semi_opt.zero_grad()
            semi_loss.backward()
            semi_opt.step()
        print('avg full loss: %f, avg semi loss: %f'%(np.mean(full_loss_list), np.mean(semi_loss_list)))
        if val_data and epo % 10 == 0:
            full_model.eval()
            out_list = []
            label_list = []
            for val, label, _, _, _ in val_full_loader:
                _, output = full_model(val)
                out_list.append(output.detach().cpu().numpy())
                label_list.append(label.detach().cpu().numpy())
            '''acc'''
            prob_all = np.concatenate(out_list, axis=0)
            label_all = np.concatenate(label_list, axis=0)
            mean_loss = val_func(prob_all, label_all)

            if mean_loss<full_best_loss:
                print('full epo: %d, loss: %f'%(epo, mean_loss))
                full_best_loss = mean_loss
                save_model(full_model, full_opt, 'pretrain_full_0.ckpt')

            full_model.train()

            semi_model.eval()
            out_list = []
            label_list = []
            for val, label, _, _, _ in val_semi_loader:
                _, output = semi_model(val)
                out_list.append(output.detach().cpu().numpy())
                label_list.append(label.detach().cpu().numpy())
            '''acc'''
            prob_all = np.concatenate(out_list, axis=0)
            label_all = np.concatenate(label_list, axis=0)
            mean_loss = val_func(prob_all, label_all)

            if mean_loss < semi_best_loss:
                print('semi epo: %d, loss: %f' % (epo, mean_loss))
                semi_best_loss = mean_loss
                save_model(semi_model, full_opt, 'pretrain_semi_0.ckpt')

            semi_model.train()
    return full_model, full_opt, semi_model, semi_opt

def train(full_data, semi_data, val_semi_data, val_full_data, neg_sampler, full_model=None, semi_model=None,
          full_optimizer=None, semi_optimizer=None, loss_func = nn.MSELoss(), val_func=print_loss, out_dim=1,
          lr=0.01, t=0.5, mu=5, epoch=100, batch_size=64, weight_decay=[1e-4, 1e-3]):
    global_v['train_flag'] = False
    print('start training...')
    # dataloader
    full_loader = DataLoader(full_data,
                             batch_size=batch_size,
                             collate_fn=full_data.collate_fn,
                             shuffle=True)
    semi_loader = DataLoader(semi_data,
                             batch_size=batch_size,
                             collate_fn=semi_data.collate_fn,
                             shuffle=True)
    val_semi_loader = DataLoader(val_semi_data,
                                 batch_size=batch_size,
                                 collate_fn=val_semi_data.collate_fn,
                                 shuffle=False)
    val_full_loader = DataLoader(val_full_data,
                                 batch_size=batch_size,
                                 collate_fn=val_full_data.collate_fn,
                                 shuffle=False)

    # optimizer
    full_optimizer = torch.optim.Adam(full_model.parameters(), lr=lr, weight_decay=weight_decay[0])
    semi_optimizer = torch.optim.Adam(semi_model.parameters(), lr=lr, weight_decay=weight_decay[1])
    con_loss = ConLoss(t)

    # clear global variables
    global_v['full_loss_list'].clear()
    global_v['semi_loss_list'].clear()
    global_v['half_loss_list'].clear()
    global_v['mse_loss_list'].clear()
    global_v['con_loss_list'].clear()
    global_v['val_semi_loss_list'].clear()
    global_v['val_full_loss_list'].clear()
    global_v['val_half_loss_list'].clear()
    global_v['mean_pos'].clear()
    global_v['mean_neg'].clear()
    global_v['var_neg'].clear()

    full_model.train()
    semi_model.train()
    for epo in range(epoch):
        if global_v['train_flag']:
            break
        print(epo)
        if epo % 10 == 0:
            full_model.eval()
            semi_model.eval()

            tmp_list = []
            for sval, slabel, _, _, _ in val_semi_loader:
                semi_emb, semi_output = semi_model(sval)
                '''mean loss'''
                semi_loss1 = val_func(semi_output, slabel)
                if type(semi_loss1) is torch.Tensor:
                    semi_loss1 = semi_loss1.clone().detach().cpu().numpy()
                tmp_list.append(semi_loss1)
            global_v['val_semi_loss_list'] += tmp_list

            tmp_list = []
            for fval, flabel, _, _, _ in val_full_loader:
                full_emb, full_output = full_model(fval)
                full_loss = val_func(full_output, flabel)
                if type(full_loss) is torch.Tensor:
                    full_loss = full_loss.clone().detach().cpu().numpy()
                tmp_list.append(full_loss)
            full_mean = np.mean(tmp_list)
            global_v['val_full_loss_list'] += tmp_list

        for full, label, semi, label_, coeff in full_loader:
            neg_emb = neg_sampler.sampling().to('cuda')
            full_emb, full_output = full_model(full)

            semi_emb, semi_output = semi_model(semi)
            full_loss = loss_func(full_output, label)/const_div
            semi_loss1 = loss_func(semi_output, label_)/const_div
            '''notice!!!no .clone().detach() casue error that computatonal graph is freed so backward fails'''
            semi_loss2, pos_score, neg_score = con_loss(semi_emb, full_emb.clone().detach(), neg_emb.clone().detach(), coeff)
            semi_loss = semi_loss1 + mu * semi_loss2

            pos_score = pos_score.clone().detach()
            neg_score = neg_score.clone().detach().view(-1)

            global_v['full_loss_list'].append(full_loss.item())
            global_v['semi_loss_list'].append(semi_loss.item())
            global_v['mse_loss_list'].append(semi_loss1.item())
            global_v['con_loss_list'].append(semi_loss2.item())
            global_v['mean_pos'].append(pos_score.mean().item())
            global_v['mean_neg'].append(neg_score.mean().item())
            global_v['var_neg'].append(neg_score.var().item())

            full_optimizer.zero_grad()
            full_loss.backward()
            full_optimizer.step()
            semi_optimizer.zero_grad()
            semi_loss.backward()
            semi_optimizer.step()

            neg_sampler.update(full_model, semi_model)

        for semi, label, full, label_, coeff in semi_loader:
            neg_emb = neg_sampler.sampling().to('cuda')
            full_emb, full_output = full_model(full)

            semi_emb, semi_output = semi_model(semi)
            full_loss = loss_func(full_output, label_) / const_div
            semi_loss1 = loss_func(semi_output, label) / const_div
            '''notice!!!no .clone().detach() casue error that computatonal graph is freed so backward fails'''
            semi_loss2, pos_score, neg_score = con_loss(semi_emb, full_emb.clone().detach(), neg_emb.clone().detach(), coeff)
            semi_loss = semi_loss1 + mu * semi_loss2 * 0.5

            pos_score = pos_score.clone().detach()
            neg_score = neg_score.clone().detach().view(-1)

            global_v['full_loss_list'].append(full_loss.item())
            global_v['semi_loss_list'].append(semi_loss.item())
            global_v['mse_loss_list'].append(semi_loss1.item())
            global_v['con_loss_list'].append(semi_loss2.item())
            global_v['mean_pos'].append(pos_score.mean().item())
            global_v['mean_neg'].append(neg_score.mean().item())
            global_v['var_neg'].append(neg_score.var().item())

            semi_optimizer.zero_grad()
            semi_loss.backward()
            semi_optimizer.step()

            neg_sampler.update(full_model, semi_model)

            full_model.train()
            semi_model.train()

    global_v['train_flag'] = True
    global_v['full_model'].eval()
    global_v['semi_model'].eval()

def np_cos(x,y):
    xnorm = np.linalg.norm(x, ord=2)
    ynorm = np.linalg.norm(y, ord=2)
    return np.dot(x, y)/xnorm/ynorm

def dim_cos(x,y):
    x = x/(1e-5+x.norm(dim=1)[:,None])
    y = y/(1e-5+y.norm())
    res = x@y.transpose(-1,-2)
    return res

@torch.no_grad()
def project(full_model, semi_model, full_data, semi_data):
    tsne = TSNE(n_components=2, perplexity=100)

    raw_data = global_v['data']

    full_index = full_data.data.index.tolist()
    semi_index = semi_data.data.index.tolist()

    x1 = np.array(full_data.data)
    x2 = np.array(semi_data.data)

    full_tsne = tsne.fit_transform(x1)
    semi_tsne = tsne.fit_transform(x2)
    all_tsne = np.vstack((full_tsne, semi_tsne))

    scaler = MinMaxScaler(feature_range=(-1, 1))

    all_tsne_minmax = scaler.fit_transform(all_tsne)
    full_tsne_minmax = all_tsne_minmax[:np.shape(full_tsne)[0], :].tolist()
    semi_tsne_minmax = all_tsne_minmax[np.shape(full_tsne)[0]:, :].tolist()

    list1 = []
    tmp = full_data.collate_fn(full_data[0])[0]
    anchor, _ = full_model(tmp)

    full_loader = DataLoader(full_data,
                                 batch_size=128,
                                 collate_fn=full_data.collate_fn,
                                 shuffle=False)
    semi_loader = DataLoader(semi_data,
                                               batch_size=128,
                                               collate_fn=semi_data.collate_fn,
                                               shuffle=False)
    full_emb_list = []
    for data in full_loader:
        tmp = data[0]
        emb, _ = full_model(tmp)
        full_emb_list.append(emb)
    full_emb = torch.cat(full_emb_list, dim=0)
    full_cos = np.arccos(nn.CosineSimilarity()(full_emb, anchor).squeeze().cpu().numpy()-1e-7).tolist()
    for fidx, fcos, ftsne in zip(full_index, full_cos, full_tsne_minmax):
        _raw = raw_data.loc[fidx, :].to_dict()
        global_v['cos_in_projection']['full_%d' % fidx] = fcos
        list1.append({'name': 'full_%d' % fidx, 'value': fcos,# 'pca': full_pca_minmax[ct],
                      'pca': ftsne, 'raw': _raw})

    semi_emb_list = []
    for data in semi_loader:
        tmp = data[0]
        emb, _ = semi_model(tmp)
        semi_emb_list.append(emb)
    semi_emb = torch.cat(semi_emb_list, dim=0)
    semi_cos = np.arccos(nn.CosineSimilarity()(semi_emb, anchor).squeeze().cpu().numpy()-1e-7).tolist()
    for sidx, scos, stsne in zip(semi_index, semi_cos, semi_tsne_minmax):
        _raw = raw_data.loc[sidx, :].to_dict()
        global_v['cos_in_projection']['semi_%d' % sidx] = scos
        list1.append({'name': 'semi_%d' % sidx, 'value': scos,
                      'pca': stsne, 'raw': _raw})
    return list1

@torch.no_grad()
def project2(full_model, semi_model, full_data, semi_data):
    full_model.eval()
    semi_model.eval()
    list1 = []
    # tmp = full_data[0][0][:-1].view(1, -1).to('cuda')
    tmp = full_data.collate_fn(full_data[0])[0]
    anchor, _ = full_model(tmp)

    full_loader = DataLoader(full_data,
                           batch_size=128,
                           collate_fn=full_data.collate_fn,
                           shuffle=False)
    semi_loader = DataLoader(semi_data,
                           batch_size=128,
                           collate_fn=semi_data.collate_fn,
                           shuffle=False)
    full_emb_list = []
    for data in full_loader:
        tmp = data[0]
        emb, _ = full_model(tmp)
        full_emb_list.append(emb)
    full_emb = torch.cat(full_emb_list, dim=0)
    full_cos = np.arccos(nn.CosineSimilarity()(full_emb, anchor).squeeze().cpu().numpy()-1e-7).tolist()
    for i, fcos in enumerate(full_cos):
        list1.append({'name': 'full_%d' % i, 'value': fcos})

    semi_emb_list = []
    for data in semi_loader:
        tmp = data[0]
        emb, _ = semi_model(tmp)
        semi_emb_list.append(emb)
    semi_emb = torch.cat(semi_emb_list, dim=0)
    semi_cos = np.arccos(nn.CosineSimilarity()(semi_emb, anchor).squeeze().cpu().numpy()-1e-7).tolist()
    for i, scos in enumerate(semi_cos):
        global_v['cos_in_projection']['semi_%d' % i] = scos
        list1.append({'name': 'semi_%d' % i, 'value': scos})

    return list1


def root_getMissing(req=None):
    if req is None:
        dataset = 'House'
    else:
        dataset = req['dataset']

    global global_v

    global_v = {
        'data': None,
        'test': None,
        'miss_list': None,
        'label': None,
        'selected_features': None,
        'full_data': None,
        'full_map': None,
        'semi_data': None,
        'semi_map': None,
        'val_full_data': None,
        'val_semi_data': None,
        'val_full_map': None,
        'val_semi_map': None,
        'val_test_data': None,
        'val_test_map': None,
        'dummy_features': None,
        'dummy_test': None,
        'test_map': None,
        'pretrain_full_model': None,
        'pretrain_semi_model': None,
        'full_model': None,
        'semi_model': None,
        'full_opt': None,
        'semi_opt': None,
        'pos_map': None,
        'neg_sampler': None,
        'mean_pos': [],
        'mean_neg': [],
        'var_neg': [],
        'full_loss_list': [],
        'semi_loss_list': [],
        'half_loss_list': [],
        'mse_loss_list': [],
        'con_loss_list': [],
        'val_full_loss_list': [],
        'val_semi_loss_list': [],
        'val_half_loss_list': [],
        'activation': [],
        'train_flag': False,
        'left_set': {},
        'right_set': {},
        'MAP': {},
        'cos_in_projection': {},
        'neg_full': [],
        'neg_semi': [],
        'model_idx': 0,
        'model_cnt': 0,
        'model_dim': []
    }

    torch.cuda.empty_cache()

    global const_div
    if dataset == 'House':
        global_v['dataset'] = dataset
        global_v['data'], global_v['miss_list'], global_v['label'], global_v['test'] = preprocessing()
        global_v['out_dim'] = 1
        global_v['set_num'] = 10
    elif 'UCI' in dataset:
        global_v['dataset'] = 'UCI'
        subname = dataset.split('_')[1]
        global_v['data'], global_v['miss_list'], global_v['label'], global_v['test'] = preprocessing_uci(subname)
        global_v['out_dim'] = 1
        const_div = 1
        global_v['set_num'] = 10
    elif dataset == 'Credit':
        global_v['dataset'] = dataset
        global_v['data'], global_v['miss_list'], global_v['label'], global_v['test'] = preprocessing_credit()
        global_v['out_dim'] = 2
        const_div = 1
        global_v['set_num'] = 1
        '''min max'''
        tmp_df = pd.concat([global_v['data'], global_v['test']], axis=0)
        global_v['max'] = tmp_df.max(axis=0)
        global_v['min'] = tmp_df.min(axis=0)
    return global_v['miss_list']

def root_selectFeature(selected_features):
    global_v['selected_features'] = selected_features
    global_v['semi_cate_feat'] = []
    global_v['full_cate_feat'] = []
    global_v['scaler'] = None

    if global_v['dataset'] == 'Credit':
        global_v['full_cate_feat'] = list(filter(lambda x: re.match(r'^"PAY_(\d)+"', x)!=None, global_v['data'].columns))
        global_v['semi_cate_feat'] = list(filter(lambda x: re.match(r'^"PAY_(\d)+"', x)!=None, selected_features))
        global_v['scaler'] = scaler

    global_v['full_data'], global_v['full_map'], global_v['semi_data'], global_v['semi_map'], global_v['val_semi_data'], \
    global_v['val_semi_map'], global_v['val_full_data'], global_v['val_full_map'], global_v['dummy_features'], global_v[
        'data'], global_v['label'], global_v['val_test_data'], global_v['val_test_map'] \
        = get_dataloader(global_v['data'], global_v['label'], selected_features, test=global_v['test'],
                         dummy=(global_v['dataset']=='House'), cate_feat=[global_v['full_cate_feat'], global_v['semi_cate_feat']], scaler=global_v['scaler'])
    root_setPositiveFull()
    '''model configure'''
    if global_v['dataset'] == 'House':
        global_v['full_config'] = {
            'in_dim': global_v['full_data'].get_dim(), 'out_dim': 1
        }
        global_v['semi_config'] = {
            'in_dim': global_v['semi_data'].get_dim(), 'out_dim': 1
        }
        full_model = CNN(**global_v['full_config']).to('cuda')
        semi_model = CNN(**global_v['semi_config']).to('cuda')
    elif global_v['dataset'] == 'UCI':
        global_v['full_config'] = {
            'in_dim': global_v['full_data'].get_dim(), 'out_dim': 1
        }
        global_v['semi_config'] = {
            'in_dim': global_v['semi_data'].get_dim(), 'out_dim': 1
        }
        full_model = CNN(global_v['full_data'].get_dim(), out_dim=1).to('cuda')
        semi_model = CNN(global_v['semi_data'].get_dim(), out_dim=1).to('cuda')
    elif global_v['dataset'] == 'Credit':
        global_v['full_config'] = {
            'in_dim': global_v['full_data'].get_dim(), 'out_dim': 2,
            'feat_size': [len(global_v['full_data'].cate_feat), len(global_v['full_data'].rest_feat)],
            'minmax': [global_v['min'][global_v['full_data']._rest_name].values,
                       global_v['max'][global_v['full_data']._rest_name].values],
            'spar_min': global_v['min'][global_v['full_data']._cate_name].values
        }
        global_v['semi_config'] = {
            'in_dim': global_v['semi_data'].get_dim(), 'out_dim': 2,
            'feat_size': [len(global_v['semi_data'].cate_feat), len(global_v['semi_data'].rest_feat)],
            'minmax': [global_v['min'][global_v['semi_data']._rest_name].values,
                       global_v['max'][global_v['semi_data']._rest_name].values],
            'spar_min': global_v['min'][global_v['semi_data']._cate_name].values
        }
        full_model = AutoInt(**global_v['full_config']).to('cuda')
        semi_model = AutoInt(**global_v['semi_config']).to('cuda')
    '''pretrain: disable to ease reproduction'''
    # if global_v['dataset'] == 'House':
    #     pretrain_both(global_v['full_data'], global_v['semi_data'].get_dim(), full_model, semi_model,
    #                    val_data=[global_v['val_full_data'],global_v['val_semi_data']],
    #                    lr=3e-3, epoch=50, weight_decay=1e-3, loss_func=nn.MSELoss())
    # elif global_v['dataset'] == 'UCI':
    #     pretrain_both(global_v['full_data'], global_v['semi_data'].get_dim(), full_model, semi_model,
    #                   val_data=[global_v['val_full_data'], global_v['val_semi_data']],
    #                   lr=3e-3, epoch=50, weight_decay=1e-3, loss_func=nn.MSELoss(), out_dim=global_v['out_dim'])
    # elif global_v['dataset'] == 'Credit':
    #     pretrain_both(global_v['full_data'], global_v['semi_data'].get_dim(), full_model, semi_model,
    #                    val_data=[global_v['val_full_data'],global_v['val_semi_data']],
    #                    lr=3e-3, epoch=11, weight_decay=1e-2, loss_func=nn.CrossEntropyLoss(), val_func=print_metrics)
    '''load pretrain'''
    global_v['full_model'], global_v['full_opt'] = load_model(full_model, 'pretrain_full_0.ckpt')
    global_v['semi_model'], global_v['semi_opt'] = load_model(semi_model, 'pretrain_semi_0.ckpt')
    global_v['model_idx'] = 0
    global_v['model_cnt'] = 1
    global_v['model_dim'] = [global_v['semi_data'].get_dim()]


def root_getPreProjection():
    global_v['neg_semi'] = []
    global_v['neg_full'] = []
    projection = project(global_v['full_model'], global_v['semi_model'], global_v['full_data'],
                         global_v['semi_data'])
    return projection


def root_getValidNum():
    return len(global_v['semi_data'])


def root_initPos(req):
    global_v['left_set'].clear()
    global_v['right_set'].clear()
    try:
        method = req['method']
    except:
        method = 'find_sim'
    if method == 'find_sim_cos':
        semi_sim, semi_label, coeff = find_sim_cos(global_v['full_data'], global_v['semi_data'], global_v['full_model'],
                                               global_v['semi_model'])
    else:
        semi_sim, semi_label, coeff = find_sim(global_v['full_data'], global_v['semi_data'], global_v['full_model'],
                                                   global_v['semi_model'])
    '''update when dict changes: 1/abs(label1-label2)'''
    global_v['coeff'] = coeff
    left_index = global_v['semi_data'].data.index
    right_index = semi_sim.index
    '''create dict'''
    for i in range(len(left_index)):
        global_v['MAP'][left_index[i]] = right_index[i]

    left_label = global_v['semi_data'].label.sort_values()
    left_list = left_label.tolist()
    li = left_label.index.tolist()
    right_label = semi_label.sort_values()
    right_list = right_label.tolist()
    ri = right_label.index.tolist()

    set_num = global_v['set_num']
    min_val = left_list[0]
    max_val = left_list[-1]
    stride = (max_val - min_val) / set_num

    set_range = []
    ct_l = 0
    ct_r = 0
    for i in range(set_num+1):
        tmp1 = []
        for j in range(ct_l, len(left_list)):
            if left_list[j] >= (min_val + (i+1) * stride) or j == len(left_list)-1:
                global_v['left_set']['left_set_%d' % i] = li[ct_l: j]
                set_range.append({'name': 'left_set_%d' % i, 'min': left_list[ct_l],
                                  'max': left_list[j - 1], 'labels': tmp1})
                ct_l = j
                break
            tmp1.append(left_list[j])

        tmp2 = []
        for j in range(ct_r, len(right_list)):
            if right_list[j] >= (min_val + (i+1) * stride) or j == len(left_list)-1:
                global_v['right_set']['right_set_%d' % i] = ri[ct_r: j]
                set_range.append({'name': 'right_set_%d' % i, 'min': right_list[ct_r],
                                  'max': right_list[j - 1], 'labels': tmp2})
                ct_r = j
                break
            tmp2.append(right_list[j])

    links = []
    for i in range(len(global_v['left_set'].keys())):
        source_index = global_v['left_set']['left_set_%d' % i]
        target = []
        for index in source_index:
            target.append(global_v['MAP'][index])

        for j in range(len(global_v['right_set'].keys())):
            inter = set(target).intersection(set(global_v['right_set']['right_set_%d' % j]))
            if len(inter) != 0:
                _cnt = len(inter)
                links.append({'source': 'left_set_%d' % i, 'target': 'right_set_%d' % j, 'value': _cnt})

    return links, set_range, set_num+1


def root_setExpand(req):
    left_set = req[0]
    right_set = req[1]

    source_index = global_v['left_set'][left_set]
    target_index = []
    for index in source_index:
        target_index.append(global_v['MAP'][index])

    ct = 0
    links = []
    for index in target_index:
        if index in global_v['right_set'][right_set]:
            links.append({'source': int(source_index[ct]), 'target': int(index), 'value': 1, 'coeff': int(global_v['coeff'].loc[source_index[ct]])})
        ct += 1
    return links


def root_sampleDetails(req):
    flag = req[0]
    index = req[1]

    raw_data = global_v['data'].loc[index, :]
    if flag == 'left':
        raw_data = raw_data[global_v['selected_features']]

    raw_data = raw_data.to_dict()

    return raw_data


def root_connect(req):
    left = req[0]
    right = req[1]
    global_v['MAP'][left] = right
    label1 = global_v['label'].loc[left]
    label2 = global_v['label'].loc[right]


def root_map2data():
    full_data, full_label = global_v['full_data'].data, global_v['full_data'].label
    values = list(global_v['MAP'].values())
    return full_data.loc[values], full_label.loc[values], global_v['coeff']

def root_setPositiveFull():
    global_v['pos_map'] = global_v['full_data'].data.apply(lambda x: x[global_v['dummy_features']], axis=1)
    pos_coeff = pd.Series(np.ones(global_v['pos_map'].shape[0]), index=global_v['pos_map'].index)
    global_v['full_data'].set_pos(global_v['pos_map'], global_v['full_data'].label, pos_coeff,
                                  pos_cate=global_v['semi_data'].cate_feat, pos_rest=global_v['semi_data'].rest_feat)

def root_setPositive():
    semi_sim, semi_label, coeff = root_map2data()
    global_v['semi_data'].set_pos(semi_sim, semi_label, coeff,
                                  pos_cate=global_v['full_data'].cate_feat, pos_rest=global_v['full_data'].rest_feat)

def root_setNegative(req):
    m = req['neg_st']['m']

    neg_full = global_v['full_data'].get_mulitem(global_v['neg_full'])
    neg_semi = global_v['semi_data'].get_mulitem(global_v['neg_semi'])

    if global_v['dataset'] == 'House':
        model_type = 'CNN'
        full_sd = global_v['full_model'].state_dict()
        full_model_bak = CNN(**global_v['full_config']).to('cuda')
        full_model_bak.load_state_dict(full_sd)
        semi_sd = global_v['semi_model'].state_dict()
        semi_model_bak = CNN(**global_v['semi_config']).to('cuda')
        semi_model_bak.load_state_dict(semi_sd)
    elif global_v['dataset'] == 'Credit':
        model_type = 'AutoInt'
        full_sd = global_v['full_model'].state_dict()
        full_model_bak = AutoInt(**global_v['full_config']).to('cuda')
        full_model_bak.load_state_dict(full_sd)
        semi_sd = global_v['semi_model'].state_dict()
        semi_model_bak = AutoInt(**global_v['semi_config']).to('cuda')
        semi_model_bak.load_state_dict(semi_sd)
    global_v['neg_sampler'] = NegEmbedding(neg_full, neg_semi, full_model_bak, semi_model_bak, m=m, update_rate=0.5)

def root_applyNegative(req):
    samples = req['neg_sample']
    strategy = req['neg_st']['strategy']
    r = req['neg_st']['value']

    full_id = []
    semi_id = []
    for str_ in samples:
        if str_[:4] == 'full':
            full_id.append(int(str_[5:]))
        elif str_[:4] == 'semi':
            semi_id.append(int(str_[5:]))

    full_data = global_v['full_data'].get_mulitem(full_id)
    semi_data = global_v['semi_data'].get_mulitem(semi_id)

    if strategy == 'random':
        neg_full = neg_random(full_data, ratio=r)
        neg_semi = neg_random(semi_data, ratio=r)
    elif strategy == 'semi-hard':
        neg_full = neg_hard(full_data, copy.deepcopy(global_v['full_model']), ratio=r)
        neg_semi = neg_hard(semi_data, copy.deepcopy(global_v['semi_model']), ratio=r)

    global_v['neg_full'] = list(set(neg_full + global_v['neg_full']))
    global_v['neg_semi'] = list(set(neg_semi + global_v['neg_semi']))

    return ['full_'+str(item) for item in global_v['neg_full']], ['semi_'+str(item) for item in global_v['neg_semi']]

def root_startTrain(lr, epoch, t, mu):
    if global_v['dataset'] == 'House':
        train(global_v['full_data'], global_v['semi_data'], global_v['val_semi_data'], global_v['val_full_data'],
              global_v['neg_sampler'],
              global_v['full_model'], global_v['semi_model'], lr=lr, t=t, mu=mu, epoch=epoch, weight_decay=[0, 0])
    elif global_v['dataset'] == 'UCI':
        train(global_v['full_data'], global_v['semi_data'], global_v['val_semi_data'], global_v['val_full_data'],
              global_v['neg_sampler'],
              global_v['full_model'], global_v['semi_model'], lr=lr, t=t, mu=mu, epoch=epoch, loss_func=nn.MSELoss())
    elif global_v['dataset'] == 'Credit':
        train(global_v['full_data'], global_v['semi_data'], global_v['val_semi_data'], global_v['val_full_data'],
              global_v['neg_sampler'],
              global_v['full_model'], global_v['semi_model'], lr=lr, t=t, mu=mu, epoch=epoch, loss_func=nn.CrossEntropyLoss(),
              val_func=print_metrics, out_dim=2, weight_decay=[1e-4, 0])



def root_getDynamicData():
    d = {'loss_semi': global_v['semi_loss_list'], 'loss_full': global_v['full_loss_list'],
         'sup_loss': global_v['mse_loss_list'], 'con_loss': global_v['con_loss_list'],
         'val_full_loss': global_v['val_full_loss_list'], 'val_semi_loss': global_v['val_semi_loss_list'],
         'mean_pos': global_v['mean_pos'], 'mean_neg': global_v['mean_neg'], 'var_neg': global_v['var_neg'],
         'train_flag': global_v['train_flag']}
    for key, val in d.items():
        if key != 'train_flag' and len(val) == 0:
            continue
        np_d = np.array(val)
        nan_idx = np.isnan(np_d)
        np_d[nan_idx] = 10
        d[key] = np_d.tolist()
    return d


def root_getProjection():
    projection = project2(global_v['full_model'], global_v['semi_model'], global_v['full_data'], global_v['semi_data'])
    return projection


def root_getActivation():
    activation = []
    acts_list = []
    global_v['semi_model'].eval()

    map_list = global_v['semi_map']
    gcmodel = GradCamModel(global_v['semi_model']).to('cuda')

    try:
        semi_data = global_v['semi_data']
        semi_loader = DataLoader(semi_data,
                                 batch_size=1024,
                                 collate_fn=semi_data.collate_fn,
                                 shuffle=False)
        for data in semi_loader:
            global_v['semi_model'].zero_grad()
            sample = data[0]
            out, acts = gcmodel(sample)
            out = out.sum()
            loss = out
            loss.backward()
            grads = gcmodel.get_act_grads()
            pooled_grads = torch.mean(grads, dim=[0, 2])

            acts = acts*pooled_grads[None, :, None]

            acts = torch.mean(acts, dim=[1])
            acts = torch.maximum(acts, torch.zeros(acts.shape[:2]).to('cuda'))
            max_cam = torch.max(acts, dim=1)[0]
            acts = acts / (max_cam[:,None]+1e-10)
            acts_list.append(acts.detach().cpu().numpy())
        acts_list = np.concatenate(acts_list, axis=0)

        for ct, acts in enumerate(acts_list):
            acts = acts.tolist()

            tmp = []
            for i in range(len(global_v['selected_features'])):
                ans = 0
                num = 0
                for pair in map_list.items():
                    if pair[1] == i:
                        ans += acts[pair[0]]
                        num += 1
                ans = ans / num
                tmp.append({'feature': global_v['selected_features'][i], 'act': ans})
            activation.append({'sample': 'semi_%d' % ct, 'activation': tmp})
    except Exception:
        print(Exception)
    finally:
        gcmodel.unregister_hook()

    return activation

def root_inference():
    activation = []
    acts_list = []
    loss_list = []
    global_v['semi_model'].eval()

    map_list = global_v['semi_map']
    gcmodel = GradCamModel(global_v['semi_model']).to('cuda')

    try:
        test_data = global_v['val_test_data']
        test_loader = DataLoader(test_data,
                                 batch_size=128,
                                 collate_fn=test_data.collate_fn,
                                 shuffle=False)
        for data in test_loader:
            sample = data[0]
            out, acts = gcmodel(sample)
            if global_v['dataset'] == 'Credit':
                _loss = out.clone().detach().gather(1, data[1].long().unsqueeze(1))
                loss_list.append(_loss.cpu().numpy())
            else:
                loss_list.append(out.clone().detach().cpu().numpy())
            out = out.mean()
            global_v['semi_model'].zero_grad()
            loss = out
            loss.backward()
            grads = gcmodel.get_act_grads()
            pooled_grads = torch.mean(grads, dim=[0, 2])

            acts = acts * pooled_grads[None, :, None]

            acts = torch.mean(acts, dim=[1])
            acts = torch.maximum(acts, torch.zeros(acts.shape[:2]).to('cuda'))
            max_cam = torch.max(acts, dim=1)[0]
            acts = acts / (max_cam[:, None] + 1e-10)
            acts_list.append(acts.detach().cpu().numpy())
        acts_list = np.concatenate(acts_list, axis=0)
        loss_list = np.concatenate(loss_list, axis=0).squeeze()

        for ct, [acts, los, idx] in enumerate(zip(acts_list, loss_list.tolist(), test_data.data.index)):
            acts = acts.tolist()

            tmp = []
            for i in range(len(global_v['selected_features'])):
                ans = 0
                num = 0
                for pair in map_list.items():
                    if pair[1] == i:
                        ans += acts[pair[0]]
                        num += 1
                ans = ans / num
                tmp.append({'feature': global_v['selected_features'][i], 'act': ans})
            _raw = test_data.data.loc[idx].to_dict()
            activation.append({'sample': 'val_%d' % ct, 'activation': tmp, 'mse': los, 'raw': _raw})
    except Exception:
        print(Exception)
    finally:
        gcmodel.unregister_hook()

    return activation


def root_saveModel():
    model = global_v['semi_model']
    model.eval()
    if global_v['dataset'] == 'House':
        val_data = torch.tensor(np.array(global_v['val_semi_data'].data), dtype=torch.float).to('cuda')
        val_label = torch.tensor(np.array(global_v['val_semi_data'].label), dtype=torch.float).to('cuda')
        _, out = model(val_data)
        mse_func = nn.MSELoss(reduction='mean')
        mean_mse = mse_func(out, val_label).tolist() / const_div
    elif global_v['dataset'] == 'Credit':
        val_data = global_v['val_semi_data']
        loss_func = print_metrics
        val_loader = DataLoader(val_data,
                                 batch_size=512,
                                 collate_fn=val_data.collate_fn,
                                 shuffle=False)
        loss_list = []
        prob_all = []
        label_all = []
        for val, label, _, _, _ in val_loader:
            semi_emb, semi_output = model(val)
            '''acc'''
            prob_all.append(semi_output.detach().cpu().numpy())
            label_all.append(label.detach().cpu().numpy())
        prob_all = np.concatenate(prob_all, axis=0)
        label_all = np.concatenate(label_all, axis=0)
        mean_mse = loss_func(prob_all, label_all)

    return mean_mse


def root_getLasso(req):
    lasso_list = []
    for sample in req:
        lasso_list.append(global_v['cos_in_projection'][sample])

    return {'mean': float(np.mean(lasso_list)), 'var': float(np.var(lasso_list))}


def root_addLogs():
    model_idx = global_v['model_cnt']
    model_name = 'pretrain_semi_%d.ckpt'%(model_idx)
    save_model(global_v['semi_model'], global_v['semi_opt'], model_name)
    model_name_ = 'pretrain_full_%d.ckpt'%(model_idx)
    save_model(global_v['full_model'], global_v['full_opt'], model_name_)
    global_v['model_dim'].append([global_v['semi_data'].get_dim(), global_v['full_data'].get_dim()])
    print('add %d model' % global_v['model_cnt'])
    global_v['model_cnt'] += 1
    return global_v['model_cnt']-1


def root_switchLogs(req):
    model_idx = req['model']
    if model_idx < global_v['model_cnt']:
        if global_v['dataset'] == 'House':
            semi_model = CNN(**global_v['semi_config'])
            full_model = CNN(**global_v['full_config'])
        elif global_v['dataset'] == 'Credit':
            semi_model = AutoInt(**global_v['semi_config'])
            full_model = AutoInt(**global_v['full_config'])
        global_v['semi_model'], global_v['semi_opt'] = load_model(semi_model, 'pretrain_semi_%d.ckpt' % (model_idx))
        global_v['full_model'], global_v['full_opt'] = load_model(full_model, 'pretrain_full_%d.ckpt' % (model_idx))
        global_v['semi_model'].eval()
        global_v['full_model'].eval()
        print('switch to %d model idx: ' % global_v['model_idx'])
        return global_v['model_cnt']
    else:
        return -1

def root_stopTrain():
    global_v['train_flag'] = True
