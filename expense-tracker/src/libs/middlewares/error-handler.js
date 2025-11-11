const { response, error, errorDefinition } = require('../common');

const { errorResponse } = response;
const { CustomError } = error;
const { ERROR_INFO, ERROR_CODES } = errorDefinition;

const { getLogger } = require('../logger');

const logger = getLogger('middlewares/errorHandler');
// eslint-disable-next-line no-unused-vars
const errorHandlerMiddleware = (err, req, res, next) => {
  let errorInfo;

  if (err instanceof CustomError) {
    errorInfo = ERROR_INFO[err.errorCode];
  }

  if (!errorInfo) {
    errorInfo = ERROR_INFO[ERROR_CODES.INTERNAL_SERVER_ERROR];
  }

  const { statusCode } = errorInfo;
  const defaultMessage = errorInfo.message;

  const finalMessage = err.message || defaultMessage;
  const errorCode = err.errorCode || ERROR_CODES.INTERNAL_SERVER_ERROR;

  logger.error({ err, message: finalMessage }, '오류가 발생했습니다.');

  errorResponse(res, finalMessage, errorCode, statusCode);
};

module.exports = {
  errorHandlerMiddleware,
};
