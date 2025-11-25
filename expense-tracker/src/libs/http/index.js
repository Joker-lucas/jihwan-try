const axios = require('axios').default;
const { getLogger } = require('../logger');
const { getContext } = require('../context');

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
    const newConfig = { ...config };
    newConfig.traceId = getContext('traceId');
    newConfig.startTime = new Date().getTime();

    logger.info(
      {
        traceId: newConfig.traceId,
        method: newConfig.method.toUpperCase(),
        url: newConfig.url,
        params: newConfig.params,
        data: newConfig.data,
      },
      `HTTP Request Sent: ${newConfig.method.toUpperCase()} ${newConfig.url}`,
    );

    return newConfig;
  },
  (error) => {
    logger.error({ traceId: getContext('traceId'), error }, 'HTTP Request Setup Error');
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  (response) => {
    const { config, status, data } = response;
    const durationInMs = new Date().getTime() - config.startTime;

    logger.info(
      {
        traceId: config.traceId,
        durationInMs,
        status,
        method: config.method.toUpperCase(),
        url: config.url,
        data,
      },
      `HTTP Response Received: ${status} ${config.method.toUpperCase()} ${config.url}`,
    );

    return response;
  },
  (error) => {
    const { config, response, code } = error;
    const traceId = config.traceId || getContext('traceId');
    const durationInMs = config.startTime ? new Date().getTime() - config.startTime : -1;

    const logContext = {
      traceId,
      durationInMs,
      method: config.method.toUpperCase(),
      url: config.url,
    };

    if (response) {
      logger.error(
        { ...logContext, status: response.status, error: response.data },
        `HTTP Response Error: ${response.status} ${logContext.method} ${logContext.url}`,
      );
    } else if (code === 'ECONNABORTED') {
      logger.error(
        { ...logContext, code, timeout: config.timeout },
        `HTTP Request Timeout: ${logContext.method} ${logContext.url}`,
      );
    } else {
      logger.error(
        { ...logContext, code, message: error.message },
        `HTTP Network Error: ${logContext.method} ${logContext.url}`,
      );
    }
    return Promise.reject(error);
  },
);

const get = async (url, config = {}) => {
  try {
    return await instance.get(url, config);
  } catch (error) {
    const retryCount = config.retryCount || 0;
    if (retryCount < 2) {
      const newRetryCount = retryCount + 1;
      logger.info(
        {
          traceId: config.traceId || getContext('traceId'),
          url,
          retryCount: newRetryCount,
          maxRetries: 2,
        },
        `Retrying GET request: ${url}`,
      );
      await new Promise((resolve) => { setTimeout(resolve, 1000 * newRetryCount); });
      return get(url, { ...config, retryCount: newRetryCount });
    }
    throw error;
  }
};

const post = (url, data, config) => instance.post(url, data, config);
const patch = (url, data, config) => instance.patch(url, data, config);
const put = (url, data, config) => instance.put(url, data, config);
const del = (url, config) => instance.delete(url, config);

module.exports = {
  get,
  post,
  patch,
  put,
  delete: del,
};
