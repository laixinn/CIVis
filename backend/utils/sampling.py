import pandas as pd
import numpy as np
import torch
from torch.utils.data import DataLoader
from fastdtw import fastdtw

def neg_random(data, full_model=None, semi_model=None,ratio=0.2):
    if data == []:
        return []
    neg_idx = data.data.sample(frac=ratio).index.to_numpy().tolist()
    return neg_idx

def neg_hard(data, model=None, ratio=0.2):
    if len(data) == 0:
        return []
    model.eval()
    batch_size = 64
    loader = DataLoader(data,
                     batch_size=batch_size,
                     collate_fn=data.collate_fn,
                     shuffle=False)
    '''embedding'''
    emb_list, label_list = [], []
    for full, label, _, _, _ in loader:
        full_emb, full_output = model(full)
        emb_list.append(full_emb.detach().cpu())
        label_list.append(label.detach().cpu())
    emb_tensor = torch.cat(emb_list, dim=0)
    label_tensor = torch.cat(label_list)
    '''index'''
    full_index = list(map(lambda x: str(x), data.data.index.tolist()))
    index_list = full_index
    '''cosine distance'''
    emb_norm = emb_tensor.norm(dim=1)
    emb_tensor /= emb_norm[:, None]
    anchor = emb_tensor[0]
    cos_dist = torch.abs(torch.mm(anchor[None,:], emb_tensor[1:].transpose(1,0)).squeeze())/emb_norm[1:]/anchor.norm()
    '''label distance'''
    anchor_label = label_tensor[0]
    label_dist = torch.abs(anchor_label - label_tensor[1:])
    '''sort'''
    score = label_dist/torch.max(label_dist)+cos_dist
    emb_pair = [[key, val] for key, val in zip(index_list, score)]
    emb_pair = sorted(emb_pair, key=lambda x: x[1], reverse=True)
    '''find records'''
    length = int(len(emb_pair)*ratio)
    neg_idx = [int(item[0]) for item in emb_pair[:length]]
    return neg_idx

'''positive'''
def binary_sim(a,b):
    sim = 0
    _a = a[1]
    _b = b[1]
    for i,j in zip(_a, _b):
        sim += int(i==j)
    return sim

def binary_search(x, arr):
    st, ed, mid = 0, arr.shape[0]-1, None
    while(st<=ed):
        mid = int((st+ed)/2)
        if x == arr.iloc[mid]:
            return mid
        elif x<arr.iloc[mid]:
            ed = mid - 1
        else:
            st = mid + 1
    if abs(arr.iloc[st]-x) > abs(arr.iloc[ed]-x):
        return ed
    else:
        return st

def find_sim(full_data, semi_data, full_model=None, semi_model=None, ratio=0.4, topk=5):
    assert full_data.data.shape[0] != 0 and semi_data.data.shape[0] != 0
    full_model.eval()
    semi_model.eval()
    batch_size = 64
    full_loader = DataLoader(full_data,
                             batch_size=batch_size,
                             collate_fn=full_data.collate_fn,
                             shuffle=False)
    semi_loader = DataLoader(semi_data,
                             batch_size=batch_size,
                             collate_fn=semi_data.collate_fn,
                             shuffle=False)
    '''embedding'''
    semi_emb_list, semi_label_list, full_emb_list, full_label_list = [], [], [], []
    for full, label, semi, _, _ in full_loader:
        full_emb, full_output = full_model(full)
        full_emb_list.append(full_emb.detach().cpu())
        full_label_list.append(label.detach().cpu())
    for semi, label, full, _, _ in semi_loader:
        semi_emb, semi_output = semi_model(semi)
        semi_emb_list.append(semi_emb.detach().cpu())
        semi_label_list.append(label.detach().cpu())
    semi_emb = torch.cat(semi_emb_list, dim=0)
    semi_label = torch.cat(semi_label_list)
    full_emb = torch.cat(full_emb_list, dim=0)
    full_label = torch.cat(full_label_list)
    '''index'''
    full_index = full_data.data.index.tolist()
    semi_index = semi_data.data.index.tolist()
    '''cosine distance'''
    semi_norm = semi_emb.norm(dim=1)
    full_norm = full_emb.norm(dim=1)
    cos_dist = torch.abs(torch.mm(semi_emb, full_emb.transpose(1,0)))/semi_norm.unsqueeze(1)/full_norm.unsqueeze(0)
    '''label distance'''
    label_dist = torch.abs(semi_label[:,None]-full_label[None,:])
    '''sort'''
    cos_norm, _ = torch.max(cos_dist, dim=1)
    label_norm, _ = torch.max(label_dist, dim=1)
    score = cos_dist - label_dist/torch.max(label_dist)
    max_score, index = torch.topk(torch.Tensor(score), k=topk, dim=1)
    max_score = max_score[:, -1]
    index = index[:, -1]
    '''find records'''
    ret_data = full_data.data.iloc[index]
    ret_label = full_data.label.iloc[index]
    tmp = (max_score > torch.mean(cos_dist)).int().numpy()
    coeff = pd.Series(tmp, index=semi_index)
    return ret_data, ret_label, coeff

def find_sim_dtw(full_data, semi_data, full_model=None, semi_model=None, ratio=0.4, topk=5):
    assert full_data.data.shape[0] != 0 and semi_data.data.shape[0] != 0
    '''index'''
    full_index = full_data.data.index.tolist()
    semi_index = semi_data.data.index.tolist()
    '''cosine distance'''
    max_score = torch.zeros(len(semi_index))
    index = torch.zeros(len(semi_index))
    max_label = semi_data.label.max()
    for i, sidx in enumerate(semi_index):
        semi_vec = semi_data.data.loc[sidx].values
        semi_lab = semi_data.label.loc[sidx]
        max_score[i] = -1
        for fidx in full_index:
            full_vec = full_data.data.loc[fidx].values
            full_lab = full_data.label.loc[fidx]
            _dist, _route = fastdtw(semi_vec, full_vec)
            _score = _dist - abs(semi_lab-full_lab)/max_label
            if _score > max_score[i]:
                max_score[i] = _score
                index[i] = fidx
    '''find records'''
    ret_data = full_data.data.iloc[index]
    ret_label = full_data.label.iloc[index]
    tmp = (max_score > torch.mean(max_score)).int().numpy()
    coeff = pd.Series(tmp, index=semi_index)
    return ret_data, ret_label, coeff

def find_sim_cos(full_data, semi_data, full_model=None, semi_model=None, ratio=0.4, topk=5):
    assert full_data.data.shape[0] != 0 and semi_data.data.shape[0] != 0
    full_label = full_data.label
    semi_label = semi_data.label
    full_data = full_data.data[semi_data.data.columns]
    semi_data = semi_data.data
    '''index'''
    full_index = full_data.index.tolist()
    semi_index = semi_data.index.tolist()
    '''cosine distance'''
    a, b = full_data.to_numpy(), semi_data.to_numpy()
    a, b = a/(np.max(a, axis=0)-np.min(a, axis=0)+1), b/(np.max(b, axis=0)-np.min(b, axis=0)+1)
    c, d = full_label.to_numpy(), semi_label.to_numpy()
    label_dist = abs(d[:, None]-c[None, :])
    score = b@a.transpose(1, 0) - label_dist/label_dist.max()
    max_score, index = torch.topk(torch.Tensor(score), k=topk, dim=1)
    max_score = max_score[:, -1]
    index = index[:, -1]
    '''find records'''
    ret_data = full_data.iloc[index]
    ret_label = full_label.iloc[index]
    tmp = (max_score > score.mean()).numpy().astype(np.int)
    coeff = pd.Series(tmp, index=semi_index)
    return ret_data, ret_label, coeff
