const cron = require('node-cron');
const { getLogger } = require('../libs/logger');
const {
  isLeader,
  initializeLeaderIdentification,
  stopLeaderIdentification,
} = require('./leader-identification');
const { intervalChecklistStatusUpdateJob } = require('../services/challenge-checklist');

const logger = getLogger('src/jobs/scheduler.js');

const runningJobs = new Set();
const scheduledTasks = [];

const jobs = [
  {
    name: '챌린지 체크리스트 상태 업데이트',
    schedule: '0 1 * * *',
    task: intervalChecklistStatusUpdateJob,
  },
];

const initializescheduler = () => {
  logger.info('크론 스케줄러를 초기화합니다.');

  initializeLeaderIdentification();

  jobs.forEach((job) => {
    const task = cron.schedule(job.schedule, async () => {
      if (!isLeader()) {
        return;
      }
      if (runningJobs.has(job.name)) {
        return;
      }

      logger.info(`'${job.name}' 작업을 시작합니다.`);
      try {
        runningJobs.add(job.name);

        await job.task();

        logger.info(`'${job.name}' 작업을 성공적으로 완료했습니다.`);
      } catch (error) {
        logger.error(`'${job.name}' 작업 실행 중 오류 발생:`, error);
      }
      runningJobs.delete(job.name);
    });

    scheduledTasks.push(task);
    logger.info(`'${job.name}' 작업이 스케줄(${job.schedule})에 따라 등록되었습니다.`);
  });
};

const stopScheduler = () => {
  logger.info('크론 스케줄러를 중지합니다.');

  stopLeaderIdentification();

  scheduledTasks.forEach((task) => {
    task.stop();
  });

  logger.info('모든 크론 작업이 성공적으로 중지되었습니다.');
};

module.exports = {
  initializescheduler,
  stopScheduler,
};
