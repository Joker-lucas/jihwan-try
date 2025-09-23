const { randomUUID } = require('crypto');
const { asyncLocalStorage, setContext } = require('../context');
const { getLogger } = require('../../libs/logger');
const logger = getLogger('middlewares/initialize-context');

const setupContext = async (req, res, next) => {
  const requestContext = new Map();

  req.requestContextStore = requestContext;
  
  asyncLocalStorage.run(requestContext, () => {
      setContext('traceId', randomUUID());
      next();
  });
};

module.exports = {
  setupContext,
};