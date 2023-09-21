import torch
import os
import torch.nn as nn
from torch.nn import functional as F
from utils.utils import get_pretrain

# ResNet18
class ResBlock(nn.Module):
    def __init__(self, inchannel, outchannel, stride=1):
        super(ResBlock, self).__init__()
        self.left = nn.Sequential(
            nn.Conv2d(inchannel, outchannel, kernel_size=3, stride=stride, padding=1, bias=False),
            nn.BatchNorm2d(outchannel),
            nn.ReLU(inplace=True),
            nn.Conv2d(outchannel, outchannel, kernel_size=3, stride=1, padding=1, bias=False),
            nn.BatchNorm2d(outchannel)
        )
        self.shortcut = nn.Sequential()
        if stride != 1 or inchannel != outchannel:
            self.shortcut = nn.Sequential(
                nn.Conv2d(inchannel, outchannel, kernel_size=1, stride=stride, bias=False),
                nn.BatchNorm2d(outchannel)
            )

    def forward(self, x):
        out = self.left(x)
        out = out + self.shortcut(x)
        out = out.relu()

        return out


class ResNet(nn.Module):
    def __init__(self, ResBlock):
        super(ResNet, self).__init__()
        self.inchannel = 64
        self.conv1 = nn.Sequential(
            nn.Conv2d(1, 64, kernel_size=3, stride=1, padding=1, bias=False),
            nn.BatchNorm2d(64),
            nn.ReLU()
        )
        self.layer1 = self.make_layer(ResBlock, 64, 2, stride=1)
        self.layer2 = self.make_layer(ResBlock, 128, 2, stride=2)
        self.fc1 = nn.Linear(1152, 100)
        self.fc2 = nn.Linear(100, 10)
        self.fc3 = nn.Linear(10, 1)

    def make_layer(self, block, channels, num_blocks, stride):
        strides = [stride] + [1] * (num_blocks - 1)
        layers = []
        for stride in strides:
            layers.append(block(self.inchannel, channels, stride))
            self.inchannel = channels
        return nn.Sequential(*layers)

    def forward(self, x):
        out = self.conv1(x)
        out = self.layer1(out)
        out = self.layer2(out)
        out = F.avg_pool2d(out, 3)
        out = out.view(out.size(0), -1)
        out = self.fc1(out)
        out = self.fc2(out)
        out = self.fc3(out)
        return out


# -*- coding: utf-8 -*-

"""
A pytorch implementation of DeepFM for rates prediction problem.
"""

import torch
import torch.nn as nn
import torch.nn.functional as F
import torch.optim as optim

from time import time

class Interact_Layer(nn.Module):
    def __init__(self, in_dim, feat_dim=8, w_dim=32, out_dim=32):
        super(Interact_Layer, self).__init__()
        self.in_dim = in_dim
        self.feat_dim = feat_dim
        self.w_dim = w_dim
        self.out_dim = out_dim
        self.wq = nn.Linear(in_dim, w_dim, bias=False)
        self.wk = nn.Linear(in_dim, w_dim, bias=False)
        self.wv = nn.Linear(in_dim, in_dim, bias=False)
        self.res = nn.Linear(in_dim*feat_dim, out_dim, bias=False)

    def forward(self, emb):
        eq, ek, ev = self.wq(emb), self.wk(emb), self.wv(emb)
        qk = eq @ ek.transpose(-1, -2) / self.feat_dim
        attn = torch.softmax(qk, dim=-1)
        attn_emb = attn @ ev
        emb = (attn_emb + emb).view(attn_emb.shape[0], -1)
        res_emb = torch.relu(self.res(emb))
        return res_emb

'''DeepCTR'''
class InteractingLayer(nn.Module):
    """A Layer used in AutoInt that model the correlations between different feature fields by multi-head self-attention mechanism.
      Input shape
            - A 3D tensor with shape: ``(batch_size,field_size,embedding_size)``.
      Output shape
            - 3D tensor with shape:``(batch_size,field_size,embedding_size)``.
      Arguments
            - **in_features** : Positive integer, dimensionality of input features.
            - **head_num**: int.The head number in multi-head self-attention network.
            - **use_res**: bool.Whether or not use standard residual connections before output.
            - **seed**: A Python integer to use as random seed.
      References
            - [Song W, Shi C, Xiao Z, et al. AutoInt: Automatic Feature Interaction Learning via Self-Attentive Neural Networks[J]. arXiv preprint arXiv:1810.11921, 2018.](https://arxiv.org/abs/1810.11921)
    """

    def __init__(self, embedding_size, head_num=2, use_res=True, scaling=False, seed=1024, device='cpu'):
        super(InteractingLayer, self).__init__()
        if head_num <= 0:
            raise ValueError('head_num must be a int > 0')
        if embedding_size % head_num != 0:
            raise ValueError('embedding_size is not an integer multiple of head_num!')
        self.att_embedding_size = embedding_size // head_num
        self.head_num = head_num
        self.use_res = use_res
        self.scaling = scaling
        self.seed = seed

        self.W_Query = nn.Parameter(torch.Tensor(embedding_size, embedding_size), requires_grad=True)
        self.W_key = nn.Parameter(torch.Tensor(embedding_size, embedding_size), requires_grad=True)
        self.W_Value = nn.Parameter(torch.Tensor(embedding_size, embedding_size), requires_grad=True)

        if self.use_res:
            self.W_Res = nn.Parameter(torch.Tensor(embedding_size, embedding_size))
        for tensor in self.parameters():
            nn.init.normal_(tensor, mean=0.0, std=0.05)

        self.to(device)

    def forward(self, inputs):

        if len(inputs.shape) != 3:
            raise ValueError(
                "Unexpected inputs dimensions %d, expect to be 3 dimensions" % (len(inputs.shape)))

        # None F D
        querys = torch.tensordot(inputs, self.W_Query, dims=([-1], [0]))
        keys = torch.tensordot(inputs, self.W_key, dims=([-1], [0]))
        values = torch.tensordot(inputs, self.W_Value, dims=([-1], [0]))

        # head_num None F D/head_num
        querys = torch.stack(torch.split(querys, self.att_embedding_size, dim=2))
        keys = torch.stack(torch.split(keys, self.att_embedding_size, dim=2))
        values = torch.stack(torch.split(values, self.att_embedding_size, dim=2))

        inner_product = torch.einsum('bnik,bnjk->bnij', querys, keys)  # head_num None F F
        if self.scaling:
            inner_product /= self.att_embedding_size ** 0.5
        self.normalized_att_scores = F.softmax(inner_product, dim=-1)  # head_num None F F
        result = torch.matmul(self.normalized_att_scores, values)  # head_num None F D/head_num

        result = torch.cat(torch.split(result, 1, ), dim=-1)
        result = torch.squeeze(result, dim=0)  # None F D
        if self.use_res:
            result += torch.tensordot(inputs, self.W_Res, dims=([-1], [0]))
        result = F.relu(result)

        return result


class AutoInt(nn.Module):
    def __init__(self, in_dim, emb_dim=8, out_dim=2, feat_size=[0, 0], n_layers=1, head_num=1, minmax=[], spar_min=[]):
        super(AutoInt, self).__init__()
        self.in_dim = in_dim
        self.emb_dim = emb_dim
        self.out_dim = out_dim
        self.feat_size = feat_size # sparse first, dense second
        self.n_layers = n_layers
        self.voc_size = 13
        self.init_dim = 8
        self.spar_min = spar_min

        self.sparse_size = feat_size[0]
        self.dense_size = feat_size[1]
        self.sparse_emb = nn.ModuleList([nn.Embedding(self.voc_size, self.init_dim) for i in range(self.sparse_size)])
        self.dense_emb = nn.ModuleList([nn.Linear(1, self.init_dim) for i in range(self.dense_size)])
        self.conv2 = nn.Conv1d(in_channels=self.init_dim, out_channels=self.init_dim, kernel_size=5, stride=1, padding=2)
        # self.interact = Interact_Layer(self.init_dim, feat_dim=self.sparse_size+self.dense_size, w_dim=self.in_dim, out_dim=emb_dim)
        self.interact = nn.ModuleList([InteractingLayer(self.init_dim, head_num=head_num, device='cuda') for _ in range(n_layers)])
        self.fc0 = nn.Linear(in_dim*self.init_dim, self.emb_dim)
        self.fc1 = nn.Linear(self.emb_dim, self.out_dim)
        self.minmax = 0
        if len(minmax) == 2:
            self.minmax = 1
            self._min = torch.FloatTensor(minmax[0]).to('cuda')
            self._max = torch.FloatTensor(minmax[1]).to('cuda')
        self.mmin = 0
        if len(spar_min) > 0:
            self.mmin = 1
            self.spar_min = spar_min
            if type(self.spar_min) != torch.LongTensor:
                self.spar_min = torch.LongTensor(self.spar_min).to('cuda')

    def scaler(self, x):
        return (x-self._min)/(self._max-self._min)

    def forward(self, x, flag=0):
        spar, dens = x
        if self.minmax:
            dens = self.scaler(dens)
        if self.mmin:
            spar -= self.spar_min
        spar_feat = torch.stack([emb_fun(spar[:, i].long()) for i, emb_fun in enumerate(self.sparse_emb)], dim=1)
        dens_feat = torch.stack([emb_fun(dens[:, i].unsqueeze(1)) for i, emb_fun in enumerate(self.dense_emb)], dim=1)
        cat_feat = torch.cat([spar_feat, dens_feat], dim=1)
        infeat = cat_feat
        for _layer in self.interact:
            infeat = _layer(infeat)
        infeat = self.conv2(infeat.transpose(-1, -2)).transpose(-1, -2)
        emb = self.fc0(torch.flatten(infeat, start_dim=1))
        out = torch.softmax(self.fc1(emb),dim=1)
        return emb, out


class CNN(nn.Module):
    def __init__(self, in_dim, emb_dim=128, out_dim=1):
        super(CNN, self).__init__()
        self.in_dim = in_dim
        self.emb_dim = emb_dim
        self.out_dim = out_dim
        self.dim1 = int((in_dim-5)/1+1)
        self.dim2 = int((self.dim1 - 5) / 1 + 1)
        self.dim3 = int((self.dim2 - 5) / 1 + 1)
        self.dim4 = self.in_dim*32
        self.conv1 = nn.Conv1d(in_channels=1, out_channels=16, kernel_size=5, stride=1, padding=2)
        self.conv2 = nn.Sequential(
            nn.Conv1d(in_channels=16, out_channels=32, kernel_size=5, stride=1, padding=2),
            nn.ReLU()
        )
        self.conv3 = nn.Sequential(
            nn.Conv1d(in_channels=32, out_channels=32, kernel_size=5, stride=1, padding=2),
            nn.ReLU()
        )
        self.fc1 = nn.Linear(self.dim4, 128)
        self.fc2 = nn.Linear(128, 64)
        self.out = nn.Linear(64, out_dim)
        self.do = nn.Dropout(p=0.6)

    def forward(self, x, flag=0):
        if len(x) == 0:
            return x, None
        if len(x.shape) == 2:
            x=x.unsqueeze(1)
        x = self.conv1(x)
        x = self.conv2(x)
        x = self.conv3(x)
        if flag:
            print(x.abs().sum())
        x = x.view(x.size(0), -1)
        x = self.do(x)
        emb = self.fc1(x)
        R = self.fc2(emb)
        F = self.out(R).squeeze()
        return emb, F

class FC(nn.Module):
    def __init__(self, in_dim):
        super(CNN, self).__init__()
        self.in_dim = in_dim
        self.fc1 = nn.Linear(self.in_dim, 128)
        self.fc2 = nn.Linear(128, 64)
        self.out = nn.Linear(64, 1)

    def forward(self, x, flag=0):
        if flag:
            print(x.abs().sum())
        emb = self.fc1(x)
        R = self.fc2(emb)
        F = self.out(R).squeeze()
        return emb, F

class ConLoss(nn.Module):
    def __init__(self, t=0.05):
        super(ConLoss, self).__init__()
        self.cos = nn.CosineSimilarity(dim=1)
        self.ls = nn.LogSoftmax(dim=1)
        self.t = t

    def forward(self, x, pos, neg, coeff):
        x = x/(1e-5+x.norm(dim=1).unsqueeze(1))
        pos = pos/(1e-5+pos.norm(dim=1).unsqueeze(1))
        neg = neg/(1e-5+neg.norm(dim=1).unsqueeze(1))
        xpos = self.cos(x, pos)
        xneg = torch.mm(x, neg.transpose(1,0))
        x = torch.cat([xpos[:,None], xneg], dim=1)
        loss = -self.ls(x/self.t)[:, 0]*coeff
        return loss.sum()/loss.shape[0], xpos, xneg

class semiCNN(nn.Module):
    def __init__(self):
        super(semiCNN, self).__init__()
        self.conv1 = nn.Sequential(  # input shape (1,15,15)
            nn.Conv2d(in_channels=1,
                      out_channels=16,
                      kernel_size=3,
                      stride=1,
                      padding=1),
            nn.ReLU(),
            # nn.MaxPool2d(kernel_size=2)  # output shape (16,15,15)
        )
        self.conv2 = nn.Sequential(  # output shape(32,15,15)
            nn.Conv2d(16, 32, 3, 1, 1),
            nn.ReLU()
        )
        self.fc1 = nn.Linear(32 * 15 * 15, 1000)
        self.fc2 = nn.Linear(1000, 100)
        self.out = nn.Linear(100, 1)

    def forward(self, x):
        x = self.conv1(x)
        # print('hao:', x.size())
        x = self.conv2(x)
        x = x.view(x.size(0), -1)
        x = self.fc1(x)
        R = self.fc2(x)
        F = self.out(R)
        return R, F

class GradCamModel(nn.Module):
    def __init__(self, pretrained_model):
        super().__init__()
        self.gradients = None
        self.tensorhook = []
        self.layerhook = []
        self.selected_out = None

        # PRETRAINED MODEL
        self.pretrained = pretrained_model
        if type(pretrained_model) == CNN:
            self.layerhook.append(self.pretrained.conv2.register_forward_hook(self.forward_hook()))
        elif type(pretrained_model) == AutoInt:
            self.layerhook.append(self.pretrained.conv2.register_forward_hook(self.forward_hook()))

        for p in self.pretrained.parameters():
            p.requires_grad = True

    def activations_hook(self, grad):
        self.gradients = grad

    def get_act_grads(self):
        return self.gradients

    def forward_hook(self):
        def hook(module, inp, out):
            self.selected_out = out
            self.tensorhook.append(out.register_hook(self.activations_hook))

        return hook

    def unregister_hook(self):
        for item in self.layerhook:
            item.remove()

    def forward(self, x):
        _, out = self.pretrained(x)
        return out, self.selected_out

class GradAccess(nn.Module):
    def __init__(self, pretrained_model):
        super().__init__()
        self.gradients = None
        self.tensorhook = []
        self.layerhook = []
        self.selected_out = None

        # PRETRAINED MODEL
        self.pretrained = pretrained_model
        self.layerhook.append(self.pretrained.fc1.register_forward_hook(self.forward_hook()))

        for p in self.pretrained.parameters():
            p.requires_grad = True

    def activations_hook(self, grad):
        self.gradients = grad

    def get_act_grads(self):
        return self.gradients

    def forward_hook(self):
        def hook(module, inp, out):
            self.selected_out = out
            self.tensorhook.append(out.register_hook(self.activations_hook))

        return hook

    def forward(self, x):
        emb, out = self.pretrained(x)
        return emb, out, self.selected_out

def save_model(model, opt, name):
    torch.save({
        'state_dict': model.state_dict(),
        'optimizer': opt.state_dict()
    }, os.path.join(get_pretrain(), name))

def load_model(model, name, lr=3e-3):
    ckpt = torch.load(os.path.join(get_pretrain(), name))
    model.load_state_dict(ckpt['state_dict'])
    model = model.to('cuda')
    '''notice: define opt after model to cuda, otherwise different device error raises'''
    opt = torch.optim.Adam(model.parameters(), lr=lr)
    return model, opt

class NegEmbedding(nn.Module):
    '''
    :param
    the first output of full model and semi model must be embedding
    full rate and semi rate sum up to 1
    '''
    def __init__(self, full_data, semi_data, full_model, semi_model,
                 full_rate=0.5, semi_rate=0.5, update_rate=0.1, m=0.99, model_type='CNN', semi_param=None, full_param=None):
        super(NegEmbedding, self).__init__()
        self.full_rate = full_rate
        self.semi_rate = semi_rate
        self.update_rate = update_rate
        self.m = m
        self.full_data = full_data
        self.semi_data = semi_data

        self.full_queue = torch.FloatTensor([]).to('cuda')
        self.semi_queue = torch.FloatTensor([]).to('cuda')
        self.full_length = len(full_data)
        self.semi_length = len(semi_data)
        self.full_cur = 0
        self.semi_cur = 0

        self.full_model = full_model
        self.semi_model = semi_model
        self.full_model = self.full_model.to('cuda')
        self.semi_model = self.semi_model.to('cuda')

        for param in self.full_model.parameters():
            param.requires_grad = False
        for param in self.semi_model.parameters():
            param.requires_grad = False

        self.preprocess()

    def preprocess(self):
        if self.full_length > 0:
            self.full_cur = int(self.full_length * self.full_rate)
            full_new = self.full_data.collate_fn(self.full_data[:self.full_cur])[0]
            self.full_queue, _ = self.full_model(full_new)

        if self.semi_length > 0:
            self.semi_cur = int(self.semi_length * self.semi_rate)
            semi_new = self.semi_data.collate_fn(self.semi_data[:self.semi_cur])[0]
            self.semi_queue, _ = self.semi_model(semi_new)

    @torch.no_grad()
    def update(self, full_q, semi_q):
        for param_q, param_k in zip(full_q.parameters(), self.full_model.parameters()):
            param_k.data = param_k.data*self.m + param_q*(1-self.m)
        for param_q, param_k in zip(semi_q.parameters(), self.semi_model.parameters()):
            param_k.data = param_k.data*self.m + param_q*(1-self.m)

    @torch.no_grad()
    def sampling(self):
        ret_full, ret_semi = self.full_queue.clone(), self.semi_queue.clone()

        if self.full_length > 0:
            full_idx = int(self.full_length * self.update_rate * self.full_rate)
            full_new = self.full_data.collate_fn(self.full_data[self.full_cur:self.full_cur+full_idx])[0]
            full_emb, _ = self.full_model(full_new)
            self.full_queue = torch.cat([self.full_queue[full_idx:], full_emb], dim=0)
            self.full_cur = min(self.full_length, self.full_cur+full_idx) % self.full_length

        if self.semi_length > 0:
            semi_idx = int(self.semi_length * self.update_rate * self.semi_rate)
            semi_new = self.semi_data.collate_fn(self.semi_data[self.semi_cur:self.semi_cur + semi_idx])[0]
            semi_emb, _ = self.semi_model(semi_new)
            self.semi_queue = torch.cat([self.semi_queue[semi_idx:], semi_emb], dim=0)
            self.semi_cur = min(self.semi_length, self.semi_cur + semi_idx) % self.semi_length
        '''remember the norm'''
        result = torch.cat([ret_full, ret_semi], dim=0)
        return nn.functional.normalize(result, dim=1)