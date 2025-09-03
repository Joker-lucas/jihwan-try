const express = require('express');
const { customerRoute, productRoute } = require('./route');
const { connectToDatabase } = require('./libs/db'); 

const app = express();
const port = 3000;

app.use(express.json());
app.use('/customer', customerRoute);
app.use('/product', productRoute);

const startServer = async () => {
    try {
        await connectToDatabase();
        
        app.listen(port, () => {
            console.log(`서버 실행 중. 포트번호: ${port}!`);
        });
    } catch (error) {
        console.error('서버 시작에 실패했습니다.');
    }
};

startServer();