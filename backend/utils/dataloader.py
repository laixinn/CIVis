import torch
import torch.nn as nn
from torch.utils.data import Dataset
import pandas as pd
import os
from utils.utils import get_rawdata, get_uci, get_credit


class HousePrice(Dataset):
    def __init__(self, data, label, dtype=torch.float64, cate_feat=[], scaler=None):
        super(HousePrice, self).__init__()
        self.data = data
        self.label = label
        self.pos = False
        self._dtype = dtype
        self.cate_feat = cate_feat
        self.rest_feat = list(set(list(range(len(data.columns))))-set(self.cate_feat))
        self.scaler = scaler

    def __len__(self):
        return self.data.shape[0]

    def __getitem__(self, index):
        if type(index) != slice:
            index = [index]
        pos_data, coeff = None, 1
        if self.pos:
            pos_data = torch.cat([torch.FloatTensor(self.pos_data.iloc[index].values),
                                  torch.FloatTensor(self.pos_label.iloc[index].values).unsqueeze(1)], dim=1)
            coeff = torch.FloatTensor(self.pos_coeff.iloc[index].values)
        return torch.cat([torch.FloatTensor(self.data.iloc[index].values),
                          torch.FloatTensor(self.label.iloc[index].values).unsqueeze(1)], dim=1), \
               pos_data, coeff

    @property
    def _cate_name(self):
        return self.data.columns[self.cate_feat]

    @property
    def _rest_name(self):
        return self.data.columns[self.rest_feat]

    def get_mulitem(self, index):
        if index == []:
            return []
        data = self.data.loc[index]
        label = self.label.loc[index]
        return HousePrice(data, label, cate_feat=self.cate_feat)

    def collate_fn(self, data):
        batch_data_, batch_label_, coeff = None, None, None
        if self.pos:
            if type(data) == list:
                batch_pos = torch.cat(list(map(lambda x: x[1], data)), dim=0)
                coeff = torch.FloatTensor(list(map(lambda x: x[2], data))).squeeze().to('cuda')
            else:
                batch_pos = data[1]
                coeff = torch.FloatTensor(data[2]).squeeze().to('cuda')
            batch_data_ = batch_pos[:, :-1].to('cuda')
            batch_label_ = torch.Tensor(batch_pos[:, -1]).type(self._dtype).to('cuda')
            if len(self.cate_feat) != 0:
                batch_data_ = [batch_data_[:, self.pos_cate].to('cuda'), batch_data_[:, self.pos_rest].to('cuda')]
        if type(data) == list:
            batch = torch.cat(list(map(lambda x:x[0], data)),dim=0)
        else:
            batch = data[0]
        batch_data = batch[:, :-1].to('cuda')
        batch_label = torch.Tensor(batch[:, -1]).type(self._dtype).to('cuda')
        if len(self.cate_feat) != 0:
            batch_data = [batch_data[:, self.cate_feat].to('cuda'), batch_data[:, self.rest_feat].to('cuda')]
        return batch_data, batch_label, batch_data_, batch_label_, coeff

    def get_dim(self):
        return self.data.shape[1]

    def set_pos(self, pos_data, pos_label, pos_coeff, pos_cate=None, pos_rest=None):
        self.pos = True
        self.pos_data = pos_data
        self.pos_label = pos_label
        self.pos_coeff = pos_coeff
        self.pos_cate = pos_cate
        self.pos_rest = pos_rest


'''deprected'''
class NegEmbedding(nn.Module):
    '''
    :param
    the first output of full model and semi model must be embedding
    full rate and semi rate sum up to 1
    '''

    def __init__(self, full_data, semi_data, full_model, semi_model,
                 full_rate=0.5, semi_rate=0.5, update_rate=0.1, m=0.9):
        super(NegEmbedding, self).__init__()
        self.full_rate = full_rate
        self.semi_rate = semi_rate
        self.update_rate = update_rate
        self.m = m
        self.full_data = full_data
        self.semi_data = semi_data
        self.full_model = full_model
        self.semi_model = semi_model
        self.full_queue = torch.FloatTensor([])
        self.semi_queue = torch.FloatTensor([])
        self.full_length = full_data.shape[0]
        self.semi_length = semi_data.shape[0]
        self.full_cur = 0
        self.semi_cur = 0
        self.preprocess()

    def preprocess(self):
        if self.full_length > 0:
            self.full_cur = int(self.full_length * self.full_rate)
            full_new = self.full_data[:self.full_cur]
            self.full_queue, _ = self.full_model(full_new)

        if self.semi_length > 0:
            self.semi_cur = int(self.semi_length * self.semi_rate)
            semi_new = self.semi_data[:self.semi_cur]
            self.semi_queue, _ = self.semi_model(semi_new)

    @torch.no_grad()
    def update(self, full_q, semi_q):
        for param_q, param_k in zip(full_q.parameters(), self.full_model.parameters()):
            param_k.data = param_k.data * self.m + param_q.data * (1 - self.m)
        for param_q, param_k in zip(semi_q.parameters(), self.semi_model.parameters()):
            param_k.data = param_k.data * self.m + param_q.data * (1 - self.m)

    @torch.no_grad()
    def sampling(self):
        ret_full, ret_semi = self.full_queue.clone(), self.semi_queue.clone()

        if self.full_length > 0:
            full_idx = int(self.full_length * self.update_rate * self.full_rate)
            full_new = self.full_data[self.full_cur:self.full_cur + full_idx]
            full_emb, _ = self.full_model(full_new)
            self.full_queue = torch.cat([self.full_queue[full_idx:], full_emb], dim=0)
            self.full_cur = min(self.full_length, self.full_cur + full_idx) % self.full_length

        if self.semi_length > 0:
            semi_idx = int(self.semi_length * self.update_rate * self.semi_rate)
            semi_new = self.semi_data[self.semi_cur:self.semi_cur + semi_idx]
            semi_emb, _ = self.semi_model(semi_new)
            self.semi_queue = torch.cat([self.semi_queue[semi_idx:], semi_emb], dim=0)
            self.semi_cur = min(self.semi_length, self.semi_cur + semi_idx) % self.semi_length
        '''remember the norm'''
        result = torch.cat([ret_full, ret_semi], dim=0)
        return nn.functional.normalize(result, dim=1)


def dummy_map(alist, blist):
    adict = sorted([[i, item] for i, item in enumerate(alist)], key=lambda x: x[1])
    bdict = sorted([[i, item] for i, item in enumerate(blist)], key=lambda x: x[1].split('_')[0])
    i, j, alen, blen = 0, 0, len(adict), len(bdict)
    assert alen <= blen
    dmap = {}
    while (j < blen):
        if (adict[i][1] == bdict[j][1].split('_')[0]):
            dmap[bdict[j][0]] = adict[i][0]
            j += 1
        else:
            i += 1
    assert i == alen - 1
    return dmap


def preprocessing():
    raw_train = pd.read_csv(os.path.join(get_rawdata(), 'train.csv'))
    '''calculate data missing rate->filter_data, miss_list'''
    temp_data = raw_train.iloc[:, 1:]
    feature_names = temp_data.dtypes.index
    miss_rate = list(map(lambda x: temp_data[x].isna().sum() / len(temp_data[x]), feature_names[:-1]))
    all_miss_list = list(map(lambda x: {'feature': x[0], 'percentage': x[1]}, zip(feature_names, miss_rate)))
    miss_list = list(filter(lambda x: x['percentage'] < 0.8, all_miss_list))
    '''remove data with high missing rate'''
    del_list = list(filter(lambda x: x['percentage'] >= 0.8, all_miss_list))
    filter_data = raw_train.drop([item['feature'] for item in del_list], axis=1)
    labels = filter_data['SalePrice']
    filter_data = filter_data.drop(['Id', 'SalePrice'], axis=1)
    '''test data'''
    raw_test = pd.read_csv(os.path.join(get_rawdata(), 'test.csv'))
    return filter_data, miss_list, labels, raw_test


def preprocessing_uci(subname):
    '''construct train/test'''
    # data_path = os.path.join(get_uci(), '{}/data/data.txt'.format(subname))
    # raw_data = pd.read_csv(data_path, header=None, sep='\t')
    # data_length = len(raw_data.index)
    # permutation = np.random.choice(range(data_length), data_length, replace=False).tolist()
    # train_idx = round(data_length*0.9)
    # raw_train = raw_data.loc[raw_data.index[permutation[:train_idx]]]
    # raw_test = raw_data.loc[raw_data.index[permutation[train_idx:]]]
    # '''add missing values'''
    # train_np = raw_train.to_numpy()
    # train_feat = train_np[:, :1]
    # mask = np.random.randint(10, size=train_feat.shape) < 2
    # train_feat[mask] = np.nan
    # masked_train = np.concatenate([train_feat, train_np[:, 1:]], axis=1)
    # raw_train = pd.DataFrame(masked_train)
    # raw_train.to_csv(data_path.replace('data.txt', 'train_data.csv'))
    # raw_test.to_csv(data_path.replace('data.txt', 'test_data.csv'))
    '''load train/test'''
    data_path = os.path.join(get_uci(), '{}/data'.format(subname))
    raw_train = pd.read_csv(os.path.join(data_path, 'train_data.csv'), header=None)
    raw_test = pd.read_csv(os.path.join(data_path, 'test_data.csv'), header=None)
    '''calculate data missing rate->filter_data, miss_list'''
    temp_data = raw_train
    feature_names = temp_data.dtypes.index
    miss_rate = list(map(lambda x: temp_data[x].isna().sum() / len(temp_data[x]), feature_names[:-1]))
    all_miss_list = list(map(lambda x: {'feature': x[0], 'percentage': x[1]}, zip(feature_names, miss_rate)))
    miss_list = list(filter(lambda x: x['percentage'] < 0.8, all_miss_list))
    '''remove data with high missing rate'''
    del_list = list(filter(lambda x: x['percentage'] >= 0.8, all_miss_list))
    filter_data = raw_train.drop([item['feature'] for item in del_list], axis=1)
    labels = filter_data[filter_data.columns[-1]]
    filter_data = filter_data.drop([filter_data.columns[-1]], axis=1)
    return filter_data, miss_list, labels, raw_test

def preprocessing_credit():
    '''construct train/test'''
    # data_path = os.path.join(get_credit(), 'UCI_Credit_Card.csv')
    # raw_data = pd.read_csv(data_path, sep=',|\t')
    # data_length = len(raw_data.index)
    # permutation = np.random.choice(range(data_length), data_length, replace=False).tolist()
    # train_idx = round(data_length*0.9)
    # raw_train = raw_data.loc[raw_data.index[permutation[:train_idx]]]
    # raw_test = raw_data.loc[raw_data.index[permutation[train_idx:]]]
    '''add missing values for train'''
    # train_np = raw_train.to_numpy()
    # feat_idx = [6,12,18]
    # feat_name = raw_train.columns[feat_idx]
    # train_feat = train_np[:, feat_idx]
    # mask = np.random.randint(10, size=train_feat.shape) < 2
    # train_feat[mask] = np.nan
    # raw_train.loc[:, feat_name] = train_feat
    # raw_train.to_csv(data_path.replace('UCI_Credit_Card.csv', 'train_data.csv'))
    '''add missing values for test'''
    # test_np = raw_test.to_numpy()
    # feat_idx = [6, 12, 18]
    # feat_name = raw_test.columns[feat_idx]
    # test_feat = test_np[:, feat_idx]
    # mask = np.random.randint(10, size=test_feat.shape) < 2
    # test_feat[mask] = np.nan
    # raw_test.loc[:, feat_name] = test_feat
    # raw_test.to_csv(data_path.replace('UCI_Credit_Card.csv', 'test_data.csv'))
    '''load train/test'''
    data_path = get_credit()
    raw_train = pd.read_csv(os.path.join(data_path, 'train_data.csv'), index_col=0)
    raw_test = pd.read_csv(os.path.join(data_path, 'test_data.csv'), index_col=0)
    '''calculate data missing rate->filter_data, miss_list'''
    temp_data = raw_train.iloc[:, 1:]
    feature_names = temp_data.dtypes.index
    miss_rate = list(map(lambda x: temp_data[x].isna().sum() / len(temp_data[x]), feature_names[:-1]))
    all_miss_list = list(map(lambda x: {'feature': x[0], 'percentage': x[1]}, zip(feature_names, miss_rate)))
    miss_list = list(filter(lambda x: x['percentage'] < 0.8, all_miss_list))
    '''remove data with high missing rate'''
    del_list = list(filter(lambda x: x['percentage'] >= 0.8, all_miss_list))
    filter_data = raw_train.drop([item['feature'] for item in del_list], axis=1)
    labels = filter_data[filter_data.columns[-1]]
    filter_data = filter_data.drop(filter_data.columns[[0, -1]], axis=1)
    return filter_data, miss_list, labels, raw_test

def get_dataloader(data, labels, selected_features, train_ratio=0.90, test=None, dummy=True, cate_feat=[], scaler=None):
    """
    To be noticed:
    1) dummy must apply on the whole dataset, in case some values are not included in any case within train or val
    2) full/semi index should be independent to the data, otherwise 1) is hard to implement.
    """
    '''preprocess'''
    # data, miss_list, labels = preprocessing()
    '''drop records with nan'''
    save_index = data.index[~data[selected_features].isna().any(1)]
    drop_data = data.loc[save_index]
    drop_label = labels.loc[save_index]
    '''full/semi index'''
    left_features = list(filter(lambda x: x not in selected_features, drop_data.columns.values.tolist()))
    data_index = set(drop_data.index.tolist())
    full_index = set(drop_data.index[~drop_data[left_features].isna().any(1)].values.tolist())
    semi_index = data_index - full_index
    '''dummy feature'''
    if dummy:
        dummy_drop = pd.get_dummies(drop_data)
        drop_map = dummy_map(drop_data.columns.values.tolist(),
                             dummy_drop.columns.values.tolist())
        drop_list = sorted(drop_map.items(), key=lambda x: x[0])
        feature_list = [drop_data.columns.tolist().index(item) for item in selected_features]
        iloc_list = [item[1] in feature_list for item in drop_list]
        selected_dummy = dummy_drop.columns[iloc_list]
        semi_map = dummy_map(selected_features, selected_dummy.tolist())
    else:
        dummy_drop = drop_data
        drop_map = {i: i for i in range(drop_data.shape[1])}
        selected_dummy = selected_features
        semi_map = {i: i for i in range(len(selected_features))}
    '''split train and validatae'''
    full_drow = len(full_index)
    full_n_train = int(full_drow * train_ratio)
    full_index_list = list(full_index.copy())
    semi_drow = len(semi_index)
    semi_n_train = int(semi_drow * train_ratio)
    semi_index_list = list(semi_index.copy())
    full_val_list = set(full_index_list[full_n_train:])
    semi_val_list = set(semi_index_list[semi_n_train:])
    train_list = set(full_index_list[:full_n_train] + semi_index_list[:semi_n_train])
    full_index -= full_val_list
    semi_index -= semi_val_list
    train_data = dummy_drop.loc[list(train_list)]
    train_label = drop_label.loc[list(train_list)]
    full_val_data = dummy_drop.loc[list(full_val_list)]
    full_val_label = drop_label.loc[list(full_val_list)]
    semi_val_data = dummy_drop.loc[list(semi_val_list)]
    semi_val_label = drop_label.loc[list(semi_val_list)]
    '''full/semi data'''
    full_data = dummy_drop.loc[list(full_index)]
    full_label = train_label.loc[list(full_index)]
    semi_data = dummy_drop.loc[list(semi_index)][selected_dummy]
    semi_label = train_label.loc[list(semi_index)]
    '''check'''
    if (drop_data.loc[full_index].isnull().any().any()):
        assert False, 'nan in full data'
    if (drop_data[selected_features].loc[semi_index].isnull().any().any()):
        assert False, 'nan in semi data'
    '''data loader'''
    if len(cate_feat) > 0:
        full_cate, semi_cate = cate_feat
        full_cate_col = [full_data.columns.tolist().index(item) for item in full_cate]
        semi_cate_col = [semi_data.columns.tolist().index(item) for item in semi_cate]
    else:
        full_cate_col, semi_cate_col = [], []
    _dtype = torch.float32 if dummy else torch.int64
    full_loader = HousePrice(full_data, full_label, dtype=_dtype, cate_feat=full_cate_col, scaler=scaler)
    semi_loader = HousePrice(semi_data, semi_label, dtype=_dtype, cate_feat=semi_cate_col, scaler=scaler)
    val_semi_loader = HousePrice(full_val_data[selected_dummy], full_val_label, dtype=_dtype, cate_feat=semi_cate_col, scaler=scaler)
    val_full_loader = HousePrice(full_val_data, full_val_label, dtype=_dtype, cate_feat=full_cate_col, scaler=scaler)
    val_test_loader = HousePrice(semi_val_data[selected_dummy], semi_val_label, dtype=_dtype, cate_feat=semi_cate_col, scaler=scaler)
    '''test data'''
    # test = test[drop_data.columns.tolist()]
    # dummy_test = pd.get_dummies(test)[dummy_drop.columns.tolist()]
    # test_map = dummy_map(test.columns.values.tolist(),
    #                      dummy_test.columns.values.tolist())

    return full_loader, drop_map, semi_loader, semi_map, \
           val_semi_loader, semi_map, val_full_loader, drop_map, \
           selected_dummy, drop_data, drop_label, \
           val_test_loader, semi_map
