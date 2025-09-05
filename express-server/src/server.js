const express = require('express');
const { connectToDatabase } = require('./libs/db');
const userRoute = require('./routers/user');

const app = express();
const port = 3000;
app.use(express.json());


app.use('/users', userRoute);

const startServer = async () => {
    try {
        await connectToDatabase();

        app.listen(port, () => {
            console.log(`서버 실행 중. 포트번호: ${port}!`);
        });
    } catch (error) {
        console.error('서버 시작에 실패했습니다:', error);
    }
};

startServer();