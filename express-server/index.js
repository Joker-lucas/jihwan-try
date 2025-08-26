// index.js
const path = require('path');
const express = require('express');
const customerRoute = require('./routes/customer');
const productRoute = require('./routes/product');
const app = express(); 
const port = 3000;

app.use(express.json({ limit: '50mb' }));

app.use('/customer', customerRoute);
app.use('/product', productRoute);


const startServer = () => {
    app.listen(port, () => {
        console.log(`서버 실행중... 포트번호: ${port}!`);
    });
};

startServer();