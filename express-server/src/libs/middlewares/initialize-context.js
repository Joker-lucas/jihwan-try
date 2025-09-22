const { randomUUID } = require('crypto');
const { asyncLocalStorage, setContext } = require('../context');
const { getLogger } = require('../../libs/logger');
const logger = getLogger('middlewares/initialize-context');

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

const setupContext = async (req, res, next) => {
  const requestContext = new Map();

  await asyncLocalStorage.run(requestContext, async () => {
    try {
      const traceId = randomUUID();
      setContext('traceId', traceId);
      if (req.user) {
        setContext('user', {
          userId: req.user.userId,
          nickname: req.user.nickname,
          email: req.user.contactEmail
        });
      }
      await promiseNext(next);
      requestContext.clear();
    } catch (error) {
      requestContext.clear();
      logger.error({err: error}, `오류 발생`);

      next(error);

    }
  });
};

const init = () => {
  return async (req, res, next) => {
    await setupContext(req, res, next);
  };
};

module.exports = {
  init,
};