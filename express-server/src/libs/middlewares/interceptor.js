const { getLogger } = require('../../libs/logger');

const logger = getLogger('middlewares/interceptors');

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

const Interceptor = async (req, res, next) => {
  const startTime = Date.now();
  const method = req.method;
  const url = req.url;

  logger.info(`요청 시작: ${method} ${url}`);

  const logResponse = () => {
    const timeTaken = Date.now() - startTime;
    const { statusCode, statusMessage } = res;
    const resObject = {
      statusCode,
      statusMessage,
      responseTime: timeTaken,
    };
     logger.info(
    { res: resObject },
    `요청 완료: ${method} ${url}`
  );
  };

  try {

    await promiseNext(next);
    logResponse();

  } catch (error) {

    logResponse();
    throw error;

  }
};


module.exports = {
  Interceptor,
};