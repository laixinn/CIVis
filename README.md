# Towards Better Modeling With Missing Data: A Contrastive Learning-Based Visual Analytics Perspective

[**Video demo**]()

[**CIVis**](https://arxiv.org/abs/2309.09744) integrates a Contrastive Learing (CL) framework to enable modeling dataset with missing values, avoiding imputation, and is a visual analytics system to allow users with limited background CL knowledge to iteratively improve model training. Finally a accurate and trustworthy model makes prediction for downstream tasks, fed by incomplete data.

## How to run the system

1. Install python packages (Exclude PyTorch if you already install.)

   ```shell
   cd backend
   pip install -r requirement.txt
   ```

2. Install frontend packages

   ```shell
   cd frontend
   npm install
   ```

3. Run backend

   ```shell
   cd backend
   /opt/conda/bin/flask run --host=0.0.0.0 --port=5000
   ```

4. Run frontend

   ```shell
   cd frontend
   npm run start
   ```



## How to cite

If this paper and tool helps your research projects, please considering citing [our paper](https://ieeexplore.ieee.org/abstract/document/10149378):

```
@article{xie2023towards,
  title={Towards Better Modeling With Missing Data: A Contrastive Learning-Based Visual Analytics Perspective},
  author={Xie, Laixin and Ouyang, Yang and Chen, Longfei and Wu, Ziming and Li, Quan},
  journal={IEEE Transactions on Visualization and Computer Graphics},
  year={2023},
  publisher={IEEE}
}
```

