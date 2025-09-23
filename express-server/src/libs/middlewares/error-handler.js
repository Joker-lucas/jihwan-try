const { errorResponse, CustomError } = require('../common');
const { getLogger } = require('../logger');


const logger = getLogger('middlewares/errorHandler');

const errorHandlerMiddleware = (err, req, res, next) => {

  logger.error({ err }, '오류가 발생했습니다.');

  if(err instanceof CustomError){
    return errorResponse(res, err.message, err.statusCode, err.errorCode);
  }

  return errorResponse(res, '서버에 문제가 발생했습니다.', 500);
};

module.exports = {
  errorHandlerMiddleware,
};