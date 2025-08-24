const path = require('path');
const express = require('express');
const customerRoute = require('./routes/customer');
const productRoute = require('./routes/product');
const db = require('./config/db'); 
const app = express(); 
const port = 3000;

app.use(express.json({ limit: '50mb' }));
/* JSON 형식으로 데이터를 보낼, 때 그 데이터를 자동 파싱 후 javascript 객체로 변환 
(JSON 형식으로 전송된 데이터를 서버는 그대로 사용 불가능)
변환된 객체를 req.body 라는 객체 안에 넣어줌 (limit으로 최대 50mb 제한 설정)
*/

app.use('/customer', customerRoute);
app.use('/product', productRoute);


const startServer = async () => {
    try {
        await db.initialize();
        
        app.listen(port, () => {
            console.log(`서버 실행중 포트번호: ${port}!`);
        });
    } catch (error) {
        console.error("서버 시작 중 오류가 발생:", error);
    }
};

startServer();