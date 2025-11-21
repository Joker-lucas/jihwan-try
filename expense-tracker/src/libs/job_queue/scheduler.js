const { Queue } = require('bullmq');
const { redisOptions } = require('../redis');
const { QUEUE_NAMES, JOB_TYPES, JOB_TYPE_TO_QUEUE_MAP } = require('../constants/job-queue');
const ALL_JOB_FUNCTIONS = require('../../jobs');
const { getLogger } = require('../logger');

const logger = getLogger('bullmq/scheduler.js');

const setupRepeatableJobs = async () => {
  logger.info('반복 작업 스케줄링을 시작.');

  const queues = {};
  Object.values(QUEUE_NAMES).forEach((queueName) => {
    queues[queueName] = new Queue(queueName, { connection: redisOptions });
  });

  const registrationPromises = Object.values(JOB_TYPES).map(
    async (jobType) => {
      const jobFunctionConfig = ALL_JOB_FUNCTIONS[jobType];
      const targetQueueName = JOB_TYPE_TO_QUEUE_MAP[jobType];

      if (jobFunctionConfig && targetQueueName) {
        const queue = queues[targetQueueName];
        // await queue.removeRepeatable(jobType, jobFunctionConfig.repeat);

        await queue.add(
          jobType,
          { jobType, payload: jobFunctionConfig.payload },
          { repeat: jobFunctionConfig.repeat },
        );
        logger.info(`반복 작업 '${jobType}'을 '${targetQueueName}' 대기열에 등록했습니다. Cron: ${jobFunctionConfig.repeat.cron}`);
      }
    },
  );

  await Promise.all(registrationPromises);

  logger.info('반복 작업 스케줄링 완료.');
};

module.exports = {
  setupRepeatableJobs,
};
