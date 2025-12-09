const { redisClient } = require('../redis');
const {
  response,
} = require('../common');
const { getLogger } = require('../logger');

const logger = getLogger('middlewares/cache');

const { successResponse } = response;

const CACHE_TTL_SECOND = 600;

const cache = async (req, res, next) => {
  const cacheKey = `cache: ${req.originalUrl}`;
  logger.info(`캐시 키 확인: ${cacheKey}`);

  try {
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      logger.info(`캐시에서 응답: ${cacheKey}`);
      const parsedData = JSON.parse(cachedData);
      return successResponse(res, parsedData.data, parsedData.statusCode);
    }

    logger.info(`캐시 없음: ${cacheKey}`);

    const originalSend = res.send.bind(res);

    res.send = (body) => {
      try {
        const responseData = JSON.parse(body);

        if (res.statusCode >= 200 && res.statusCode < 300) {
          const dataToCache = {
            data: responseData.data,
            statusCode: res.statusCode,
          };
          logger.info(`응답 캐시 저장: ${cacheKey}`);

          redisClient.set(cacheKey, JSON.stringify(dataToCache), 'EX', CACHE_TTL_SECOND);
        }
      } catch (error) {
        logger.warn('캐싱에 실패했습니다.', error);
      }

      originalSend(body);
    };

    return next();
  } catch (error) {
    logger.error('캐시 처리 중 오류 발생:', error);

    return next();
  }
};

module.exports = {
  cache,
};
