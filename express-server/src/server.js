const express = require('express');
const passport = require('passport');
// const pinoHttp = require('pino-http');
const session = require('express-session');
const RedisStore = require('connect-redis').default;

const { connectToDatabase } = require('./libs/db');
const { redisClient, connectToRedis } = require('./libs/redis');
const mainRouter = require('./routers');
const passportCookieSet = require('./libs/middlewares/passport-cookie');
const passportJwtSet = require('./libs/middlewares/passport-jwt');
const { logger } = require('./libs/logger');
const { context} = require('./libs/middlewares/context');
const { addUserToContext } = require('./libs/middlewares/auth-user-info');
const { Interceptor } = require('./libs/middlewares/interceptor');


const app = express();
const port = 3000;
app.use(express.json());

app.use(context);
app.use(Interceptor);

const startServer = async () => {
    try {
        await Promise.all([
            connectToDatabase(),
            connectToRedis()
        ]);

        const redisStore = new RedisStore({ client: redisClient });

        app.use(session({
            name: 'sssssssssid',
            store: redisStore,
            secret: 'jihwanseesion',
            resave: false,
            saveUninitialized: false,
            cookie: {
                httpOnly: true,
                maxAge: 60 * 60 * 1000

            }
        }));

        passportCookieSet.init(passport);
        passportJwtSet.init(passport);

        app.use(passport.initialize());
        app.use(passport.session());
        
        app.use(addUserToContext);

        app.use('/api', mainRouter);

        app.listen(port, () => {
            logger.info(`서버 실행 중. 포트번호: ${port}!`);
        });


    } catch (error) {
        logger.error(error, '서버 시작에 실패했습니다:', );
    }
};

startServer();