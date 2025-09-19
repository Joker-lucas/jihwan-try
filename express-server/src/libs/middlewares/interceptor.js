const path = require('path');

const { getContext } = require('./context');
const { getLogger } = require('../../libs/logger');

const loggerPath = path.relative(process.cwd(), __filename);
const logger = getLogger(loggerPath);

const waitFinish = (res) => {
  return new Promise((resolve) => {
    res.on('finish', resolve);
  });
};


const Interceptor = async (req, res, next) => {
  const startTime = Date.now();
  const traceId = getContext('traceId');
  const method = req.method;
  const url = req.url;

  logger.info({ traceId }, `요청 시작: ${method} ${url}`);

  next();

  await waitFinish(res);

  const timeTaken = Date.now() - startTime;
  const statusCode = res.statusCode;
  const statusMessage = res.statusMessage;

  const resObject = {
    statusCode,
    statusMessage,
    responseTime: timeTaken
  }

  logger.info(
    { traceId, res: resObject },
    `요청 완료: ${method} ${url}`
  );
};


module.exports = {
  Interceptor
};