const Redis = require('ioredis');

const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  enableOfflineQueue: false,
});

const connectToRedis = () => {

    return new Promise((resolve, reject) => {

        redisClient.on('connect', () => {
            console.log('Redis연결 성공.');
            resolve();
        });
        
        redisClient.on('error', (err) => {
            console.error('Redis 연결 실패.:', err);
            reject(err);
        });
    });
};

module.exports = {
    redisClient,
    connectToRedis,
};