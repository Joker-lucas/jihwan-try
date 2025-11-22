const axios = require('axios').default;

const { getLogger } = require('../logger');

const logger = getLogger('http/index.js');

const instance = axios.create({
  // baseURL: 'https://some-domain.com/api/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use(
  (config) => {
    const logDetails = {};
    if (config.params) {
      logDetails.params = config.params;
    }
    if (config.data) {
      logDetails.data = config.data;
    }

    if (Object.keys(logDetails).length > 0) {
      logger.info(logDetails, `Request: ${config.method} ${config.url}`);
    } else {
      logger.info(`Request: ${config.method} ${config.url}`);
    }
    return config;
  },
  (error) => {
    logger.error('Request Error:', error);
    throw error;
  },
);

instance.interceptors.response.use(
  (response) => {
    logger.info(`Response: ${response.status} ${response.config.method} ${response.config.url}`);
    return response;
  },
  async (error) => {
    const { config, response } = error;

    if (response) {
      logger.error(`Response Error: ${response.status} ${config.method.toUpperCase()} ${config.url}`, {
        error: response.data,
      });
    } else {
      logger.error(`Network Error: ${config.method.toUpperCase()} ${config.url}`, {
        message: error.message,
      });
    }

    const shouldRetry = config.method === 'get';

    if (shouldRetry) {
      config.retryCount = config.retryCount || 0;

      if (config.retryCount < 2) {
        config.retryCount += 1;
        logger.info(`Retrying request: ${config.url}, retry count: ${config.retryCount}`);

        await new Promise((resolve) => { setTimeout(resolve, 1000 * config.retryCount); });

        return instance(config);
      }
    }

    throw error;
  },
);

module.exports = {
  get: (url, config) => instance.get(url, config),
  post: (url, data, config) => instance.post(url, data, config),
  delete: (url, config) => instance.delete(url, config),
};
