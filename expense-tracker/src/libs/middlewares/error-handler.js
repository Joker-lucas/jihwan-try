const { response, error, errorDefinition } = require('../common');
const { errorResponse } = response;
const { CustomError } = error;
const { ERROR_INFO, ERROR_CODES} = errorDefinition;



const { getLogger } = require('../logger');
const logger = getLogger('middlewares/errorHandler');

const errorHandlerMiddleware = (err, req, res, next) => {
  
  let errorInfo;

  if(err instanceof CustomError){
    errorInfo = ERROR_INFO[err.errorCode];
  }

  if (!errorInfo) {
    errorInfo = ERROR_INFO[ERROR_CODES.INTERNAL_SERVER_ERROR];
  }

  const statusCode = errorInfo.statusCode;
  const defaultMessage = errorInfo.message;

  const finalMessage = err.message || defaultMessage;
  const errorCode = err.errorCode || ERROR_CODES.INTERNAL_SERVER_ERROR;

  logger.error(
    { err, message: finalMessage,},'오류가 발생했습니다.'
  );

  errorResponse(res, finalMessage, statusCode, errorCode);
};

module.exports = {
  errorHandlerMiddleware,
};