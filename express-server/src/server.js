const express = require('express');
const session = require('express-session');
const RedisStore = require('connect-redis').default;
const Redis = require('ioredis');
const { connectToDatabase } = require('./libs/db');
const mainRouter = require('./routers');
const passport = require('passport');

require('./libs/middlewares');
 
const app = express();
const port = 3000;
app.use(express.json());


const redisClient = new Redis({
    host: 'localhost',
    port: 6379,
});

const redisStore = new RedisStore({ client: redisClient });


const startServer = async () => {
    try {
        await connectToDatabase();

        app.use(session({
            name: 'sssssssssid',
            store: redisStore, 
            secret: 'jihwanseesion', 
            resave: false,
            saveUninitialized: false,
            
        }));

        app.use(passport.initialize());
        app.use(passport.session());

        app.use('/api', mainRouter);

        app.listen(port, () => {
            console.log(`서버 실행 중. 포트번호: ${port}!`);
        });

        
    } catch (error) {
        console.error('서버 시작에 실패했습니다:', error);
    }
};

startServer();