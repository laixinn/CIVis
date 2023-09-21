# File Description
```shell
.
├── CNN.py
├── README.md
├── app.py
├── pretrain
│   ├── case1
│   │   ├── pretrain_full.ckpt
│   │   ├── pretrain_full_0.ckpt
│   │   ├── pretrain_semi.ckpt
│   │   └── pretrain_semi_0.ckpt
│   ├── case2
│   │   ├── pretrain_full_0.ckpt
│   │   └── pretrain_semi_0.ckpt
│   ├── init
│   │   ├── pretrain_full_0.ckpt.autoint
│   │   ├── pretrain_full_0.ckpt.cnn
│   │   ├── pretrain_semi_0.ckpt.autoint
│   │   └── pretrain_semi_0.ckpt.cnn
│   ├── pretrain_full.ckpt
│   ├── pretrain_full_0.ckpt
│   ├── pretrain_semi.ckpt
│   └── pretrain_semi_0.ckpt
├── rawdata
│   ├── credit_card
│   │   ├── UCI_Credit_Card.csv
│   │   ├── test_data.csv
│   │   └── train_data.csv
│   ├── test.csv
│   └── train.csv
└── utils
    ├── cnn_model.py
    ├── dataloader.py
    ├── sampling.py
    └── utils.py
```

app.py: Flask API
CNN.py: API implementation
utils.cnn_model.py: model architecture
utils.dataloder.py: data processing and dataloader
utils.sampling.py: positive and negative sampling
utils.utils.py: path reading



# Data Processing:

The two used dataset is processed. Refer to utils.dataloder.py if you interest how to process the data.



# Model Checkpoint
We provide the checkpoints of the pretrained model (init) and case studies (case1, case2) to facilitate reproduction. 'pretrain_*.ckpt' will be used as the pretrained model. And the pretraining precedure is disabled by dafault. The number of the checkpoint file indicates the i-th saved model in CIVis. Copy corresponding .ckpt file into the pretrain directory to use it.
