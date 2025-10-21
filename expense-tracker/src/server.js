const express = require('express');
const passport = require('passport');
// const pinoHttp = require('pino-http');
const session = require('express-session');
const RedisStore = require('connect-redis').default;

const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const YAML = require('js-yaml');
const path = require('path');


const { db, connectToDatabase } = require('./libs/db'); 
const { redisClient, connectToRedis } = require('./libs/redis');
const mainRouter = require('./routers');
const passportCookieSet = require('./libs/middlewares/passport-cookie');
const passportJwtSet = require('./libs/middlewares/passport-jwt');
const { setupContext } = require('./libs/middlewares/initialize-context');
const { requestLogger } = require('./libs/middlewares/requset-logger');
const { addUserContext } = require('./libs/middlewares/add-user-context');
const { logger } = require('./libs/logger');
const { errorHandlerMiddleware } = require('./libs/middlewares/error-handler');


const app = express();
const port = 3000;
app.use(express.json());

app.use(setupContext);
app.use(requestLogger);

let server;

const setGracefulShutdown = (server) => {

    const _gracefulShutDown = (signal) => {

        logger.info(`[${signal}] 종료 신호를 받았습니다. 서버 종료 시작합니다...`);

        const timeout = setTimeout(() => {
            logger.error('정리 시간이 초과되어 강제로 종료합니다.');
            process.exit(1);
        }, 60000);

        server.close(async () => {  
            logger.info('처리 중인 요청이 완료되었습니다.');
            try {
                await db.sequelize.close();
                logger.info('데이터베이스 연결이 성공적으로 종료되었습니다.');

                await redisClient.quit();
                logger.info('Redis 연결이 성공적으로 종료되었습니다.');

                logger.info('서버를 완전히 종료합니다.');
                clearTimeout(timeout);
                process.exit(0);
            } catch (error) {
                logger.error({ err: error }, '에러가 발생했습니다.');
                clearTimeout(timeout);
                process.exit(1);
            }

        });

    };
    process.on('SIGINT', () => _gracefulShutDown('SIGINT'));
    process.on('SIGTERM', () => _gracefulShutDown('SIGTERM'));
};

const _initializeFinancialYears = async () => {
    const currentYear = new Date().getFullYear();
    const yearsToGenerate = [];

    for (let i = 0; i < 10; i++) {
        yearsToGenerate.push(currentYear + i);
    }

    for (const year of yearsToGenerate) {
        for (let month = 1; month <= 12; month++) {
            await db.FinancialYear.findOrCreate({ 
                where: { year, month }
            });
        }
    }
};



const startServer = async () => {
    try {
        await Promise.all([
            connectToDatabase(),
            connectToRedis()
        ]);

        await _initializeFinancialYears();
        
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


        app.use(addUserContext);


        const swaggerDocument = YAML.load(
            fs.readFileSync(path.join(__dirname, '../swagger.yaml'), 'utf8')
        );
        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

        app.use('/api', mainRouter);

        app.use(errorHandlerMiddleware);

        server = app.listen(port, () => {
            logger.info(`서버 실행 중. 포트번호: ${port}!`);
        });

        setGracefulShutdown(server);


    } catch (error) {
        logger.error(error, '서버 시작에 실패했습니다:',);
        process.exit(1);
    }
};

startServer();