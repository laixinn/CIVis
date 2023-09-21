#-*- coding: utf-8 -*-
import re, os

abspath = os.path.abspath(os.path.join(os.path.abspath(os.path.dirname(__file__)), '..'))

def get_rawdata():
    return os.path.join(abspath, 'rawdata')

def get_fig():
    return os.path.join(abspath, 'output')

def get_pretrain():
    return os.path.join(abspath, 'pretrain')

def get_uci():
    return os.path.join(abspath, 'GRAPE/uci/raw_data')

def get_credit():
    return os.path.join(abspath, 'rawdata/credit_card')