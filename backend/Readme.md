1. install nvm
    ```bash
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
    ```
2. install lts/hydrogen
    ```bash
    nvm install lts/hydrogen
    ```
3. config .env file by putting your mongo url in [backend/.env](backend/.env)
4. install node_modules
    ```bash
    cd backend
    npm install
    ```
5. start server
    ```bash
    npm start
    ```