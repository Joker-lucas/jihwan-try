const session = require('express-session');
const RedisStore = require('connect-redis').default;


module.exports = (redisClient) => {
    const redisStore = new RedisStore({ client: redisClient });

    return session({
        name: 'sssssssssid',
        store: redisStore,
        secret: 'jihwanseesion', 
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            maxAge: 60 * 60 * 1000
        }
    });
};