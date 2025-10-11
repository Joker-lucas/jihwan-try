const { getLogger } = require('../logger');
const logger = getLogger('middlewares/requset-logger');


const requestLogger = async (req, res, next) => {
  const startTime = Date.now();
  const method = req.method;
  const url = req.url;

  req.startTime = startTime;

  logger.info(`요청 시작: ${method} ${url}`);

  const logResponse = () => {

    const timeTaken = Date.now() - startTime;
    const { statusCode, statusMessage } = res;

    const resObject = {
      statusCode,
      statusMessage,
      responseTime: timeTaken,
    };
    logger.info(
      { res: resObject },
      `요청 완료: ${method} ${url}`
    );
  };
  res.on('finish', logResponse);
  next();
};


module.exports = {
  requestLogger
};