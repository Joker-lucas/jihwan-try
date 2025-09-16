const pino = require('pino');
const { asyncLocalStorage } = require('../middlewares/context');


const logger = pino({
  level: 'info',
  mixin() {
    const store = asyncLocalStorage.getStore();
    if (!store) {
      return {};
    }
    return {
      traceId: store.get('traceId'),
      user: store.get('user')
    };
  },
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
      ignore: 'pid,hostname,req,res',
      messageFormat: '{msg}{end}',
    }
  }
});

const getLogger = (path) => {
  return {
    info: (obj, msg) => {
      if (typeof obj === 'string') {
        logger.info(`[${path}] ${obj}`);
      } else {
        logger.info(obj, `[${path}] ${msg}`);
      }
    },
    error: (obj, msg) => {
      if (obj instanceof Error) {
        logger.error(obj, `[${path}] ${msg || obj.message}`);
      } 
      else if (typeof obj === 'string') {
        logger.error(`[${path}] ${obj}`);
      } else {
        logger.error(obj, `[${path}] ${msg}`);  
      }
    },
    warn: (obj, msg) => {
       if (typeof obj === 'string') {
        logger.warn(`[${path}] ${obj}`);
      } else {
        logger.warn(obj, `[${path}] ${msg}`);
      }
    },
    debug: (obj, msg) => {
       if (typeof obj === 'string') {
        logger.debug(`[${path}] ${obj}`);
      } else {
        logger.debug(obj, `[${path}] ${msg}`);
      }
    },
  };
};

module.exports = {
  logger,
  getLogger,
};