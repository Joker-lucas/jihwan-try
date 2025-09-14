const express = require('express'); 
const passport = require('passport');

const { connectToDatabase } = require('./libs/db');
const {redisClient, connectToRedis} = require('./libs/redis');
const mainRouter = require('./routers');

const sessionSet = require('./libs/config/session');
const passportSetCookie = require('./libs/middlewares/passport-cookie');
const passportSetJwt = require('./libs/middlewares/passport-jwt');

const { authService, userService } = require('./services');
 
const app = express();
const port = 3000;
app.use(express.json());

const startServer = async () => {
    try {
        await Promise.all([
            connectToDatabase(),
            connectToRedis()
        ]);

        app.use(sessionSet(redisClient));
        passportSetCookie(passport, authService);
        passportSetJwt(passport, userService);

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