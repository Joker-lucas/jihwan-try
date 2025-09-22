const path = require('path');

const { getContext } = require('../context');
const { getLogger } = require('../../libs/logger');

const logger = getLogger('middlewares/interceptors');

const Interceptor = async (req, res, next) => {
  const promiseNext = (next) => {
    return new Promise((resolve, reject) => {
      next((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  };

  const startTime = Date.now();
  const traceId = getContext('traceId');
  const method = req.method;
  const url = req.url;

  logger.info({ traceId }, `요청 시작: ${method} ${url}`);

  try {
    await promiseNext(next);

    const timeTaken = Date.now() - startTime;
    const statusCode = res.statusCode;
    const statusMessage = res.statusMessage;

    const resObject = {
      statusCode,
      statusMessage,
      responseTime: timeTaken
    };

    logger.info(
      { traceId, res: resObject },
      `요청 완료: ${method} ${url}`
    );
  } catch (error) {
    const traceId = getContext('traceId');
    logger.error({ err: error, traceId }, `요청 처리 중 오류 발생: ${method} ${url}`);

    next(error);
  }
};


module.exports = {
  Interceptor,
};