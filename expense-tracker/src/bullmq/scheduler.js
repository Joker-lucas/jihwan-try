const { Queue } = require('bullmq');
const { redisOptions } = require('../libs/redis');
const { QUEUE_NAMES, JOB_TYPES, JOB_TYPE_TO_QUEUE_MAP } = require('../libs/constants/job-queue');
const ALL_JOB_FUNCTIONS = require('./jobs');
const { getLogger } = require('../libs/logger');

const logger = getLogger('bullmq/scheduler.js');

const setupRepeatableJobs = async () => {
  logger.info('반복 작업 스케줄링을 시작.');

  const queues = {};
  Object.values(QUEUE_NAMES).forEach((queueName) => {
    queues[queueName] = new Queue(queueName, { connection: redisOptions });
  });

  const registrationPromises = Object.values(JOB_TYPES).flatMap(
    (jobTypeGroup) => Object.values(jobTypeGroup).map(async (type) => {
      const jobFunctionConfig = ALL_JOB_FUNCTIONS[type];
      const targetQueueName = JOB_TYPE_TO_QUEUE_MAP[type];

      if (jobFunctionConfig && targetQueueName) {
        const queue = queues[targetQueueName];
        await queue.removeRepeatable(type, jobFunctionConfig.repeat);
        await queue.add(
          type,
          { type },
          { repeat: jobFunctionConfig.repeat },
        );
        logger.info(`반복 작업 '${type}'을 '${targetQueueName}' 대기열에 등록했습니다. Cron: ${jobFunctionConfig.repeat.cron}`);
      }
    }),
  );

  await Promise.all(registrationPromises);

  logger.info('반복 작업 스케줄링 완료.');
};

module.exports = setupRepeatableJobs;
