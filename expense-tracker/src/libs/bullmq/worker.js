const { Worker } = require('bullmq');
const { QUEUE_NAMES } = require('../constants/job-queue');

const redisOptions = {
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
};
const ALL_JOB_FUNCTIONS = require('../../jobs');
const { getLogger } = require('../logger');

const logger = getLogger('bullmq/worker.js');

const activeWorkers = {};

const setupWorker = async () => {
  const workerPromises = Object.values(QUEUE_NAMES).map((queueName) => {
    const worker = new Worker(queueName, async (job) => {
      const { jobType, payload } = job.data;

      const jobFunctionConfig = ALL_JOB_FUNCTIONS[jobType];

      logger.info(`[${queueName}] 대기열에서 '${jobType}' 작업을 실행합니다.`);
      try {
        const result = await jobFunctionConfig.func(payload);
        logger.info({ result }, `'${jobType}' 작업 완료`);
        return result;
      } catch (error) {
        logger.error(`'${jobType}' 작업 실행 중 오류 발생:`, error);
        throw error;
      }
    }, {
      connection: redisOptions,
      lockDuration: 30000,
    });

    activeWorkers[queueName] = worker;
    return worker;
  });
  await Promise.all(workerPromises);
};

module.exports = {
  setupWorker,
};
