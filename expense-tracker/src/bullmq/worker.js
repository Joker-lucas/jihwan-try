const { Worker } = require('bullmq');
const { QUEUE_NAMES } = require('../libs/constants/job-queue');
const { redisOptions } = require('../libs/redis');
const ALL_JOB_FUNCTIONS = require('./jobs');
const { getLogger } = require('../libs/logger');

const logger = getLogger('bullmq/worker.js');

const activeWorkers = {};

Object.values(QUEUE_NAMES).forEach((queueName) => {
  const worker = new Worker(queueName, async (job) => {
    const { type, data } = job.data;

    const jobFunctionConfig = ALL_JOB_FUNCTIONS[type];

    logger.info(`[${queueName}] 대기열에서 '${type}' 작업을 실행합니다.`);
    try {
      const result = await jobFunctionConfig.func(...data);
      logger.info(`'${type}' 작업 완료. 결과:`, result);
      return result;
    } catch (error) {
      logger.error(`'${type}' 작업 실행 중 오류 발생:`, error);
      throw error;
    }
  }, {
    connection: redisOptions,
    lockDuration: 30000,
  });

  activeWorkers[queueName] = worker;
});
