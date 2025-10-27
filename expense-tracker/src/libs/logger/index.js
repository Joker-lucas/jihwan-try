const pino = require('pino');

const { getContext } = require('../context');

const logger = pino({
  level: 'info',
  mixin() {
    const traceId = getContext('traceId');
    const user = getContext('user');

    return { traceId, user };
  },

});

const getLogger = (path) => ({
  info: (obj, msg) => {
    if (typeof obj === 'string') {
      let message = `[${path}] ${obj}`;
      if (msg) {
        message += ` ${msg}`;
      }
      logger.info(message);
    } else {
      logger.info(obj, `[${path}] ${msg}`);
    }
  },
  error: (obj, msg) => {
    if (obj instanceof Error) {
      logger.error(obj, `[${path}] ${msg || obj.message}`);
    } else if (typeof obj === 'string') {
      let message = `[${path}] ${obj}`;
      if (msg) {
        message += ` ${msg}`;
      }
      logger.error(message);
    } else {
      logger.error(obj, `[${path}] ${msg}`);
    }
  },
  warn: (obj, msg) => {
    if (typeof obj === 'string') {
      let message = `[${path}] ${obj}`;
      if (msg) {
        message += ` ${msg}`;
      }
      logger.warn(message);
    } else {
      logger.warn(obj, `[${path}] ${msg}`);
    }
  },
  debug: (obj, msg) => {
    if (typeof obj === 'string') {
      let message = `[${path}] ${obj}`;
      if (msg) {
        message += ` ${msg}`;
      }
      logger.debug(message);
    } else {
      logger.debug(obj, `[${path}] ${msg}`);
    }
  },
});

module.exports = {
  logger,
  getLogger,
};
