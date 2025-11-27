const axios = require('axios').default;
const { getLogger } = require('../logger');

const logger = getLogger('http/index.js');

const { error, errorDefinition } = require('../common');

const { CustomError } = error;
const { ERROR_CODES } = errorDefinition;

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
    newConfig.startTime = new Date().getTime();

    logger.info(
      {
        method: newConfig.method.toUpperCase(),
        url: newConfig.url,
        params: newConfig.params,
        data: newConfig.data,
      },
      `HTTP Request Sent: ${newConfig.method.toUpperCase()} ${newConfig.url}`,
    );

    return newConfig;
  },
  (axiosError) => {
    const customError = new CustomError(ERROR_CODES.HTTP_REQUEST_SETUP_FAILED);
    customError.details = axiosError;
    throw customError;
  },
);

instance.interceptors.response.use(
  (response) => {
    const { config, status, data } = response;
    const durationInMs = new Date().getTime() - config.startTime;

    logger.info(
      {
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
  (axiosError) => {
    const { config, response, code } = axiosError;
    const durationInMs = config.startTime ? new Date().getTime() - config.startTime : -1;

    const logContext = {
      durationInMs,
      method: config.method.toUpperCase(),
      url: config.url,
    };

    let customError;
    if (axiosError.response) {
      customError = new CustomError(ERROR_CODES.HTTP_RESPONSE_ERROR);
      customError.details = { ...logContext, status: response.status, error: response.data };
    } else if (code === 'ECONNABORTED') {
      customError = new CustomError(ERROR_CODES.HTTP_REQUEST_TIMEOUT);
      customError.details = { ...logContext, code, timeout: config.timeout };
    } else {
      customError = new CustomError(ERROR_CODES.HTTP_NETWORK_ERROR);
      customError.details = { ...logContext, code, message: axiosError.message };
    }
    throw customError;
  },
);

const get = async (url, config = {}) => {
  try {
    return await instance.get(url, config);
  } catch (fetchError) {
    const retryCount = config.retryCount || 0;
    if (retryCount < 2) {
      const newRetryCount = retryCount + 1;
      logger.info(
        {
          url,
          retryCount: newRetryCount,
          maxRetries: 2,
        },
        `Retrying GET request: ${url}`,
      );
      await new Promise((resolve) => { setTimeout(resolve, 1000 * newRetryCount); });
      return get(url, { ...config, retryCount: newRetryCount });
    }
    throw fetchError;
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
