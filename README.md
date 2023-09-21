# How to run the system

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

   

