const express = require('express');
const { connectToDatabase } = require('./libs/db');
const mainRouter = require('./routers');
 
const app = express();
const port = 3000;
app.use(express.json());
app.use('/api', mainRouter);

app.use('*', (req, res) => {
    res.status(404).json({ errorMsg: '페이지를 찾을 수 없습니다.' });
});


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