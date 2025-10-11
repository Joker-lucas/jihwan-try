const { randomUUID } = require('crypto');
const { asyncLocalStorage, setContext } = require('../context');
const { getLogger } = require('../../libs/logger');
const logger = getLogger('middlewares/initialize-context');


const setupContext = async (req, res, next) => {
  const requestContext = new Map();
  
  asyncLocalStorage.run(requestContext, () => {
    setContext('traceId', randomUUID());

    const cleanup = () => {
      requestContext.clear();
    };

    res.on('finish', cleanup);

    next();
  });
};

module.exports = {
  setupContext,
};