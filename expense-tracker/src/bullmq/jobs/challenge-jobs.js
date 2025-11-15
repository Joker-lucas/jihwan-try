const { JOB_TYPES } = require('../../libs/constants/job-queue');
const { intervalChecklistStatusUpdateJob } = require('../../services/challenge-checklist');
const { logger } = require('../../libs/logger');

const challengeJobs = {
  [JOB_TYPES.CHALLENGE.CHECK_LIST_STATUS_UPDATE]: {
    repeat: { cron: '0 0 * * *' }, // 매일 자정 반복
    func: async () => {
      logger.info('챌린지 체크리스트 상태 업데이트 작업 실행 시작.');
      await intervalChecklistStatusUpdateJob();
      logger.info('챌린지 체크리스트 상태 업데이트 작업 실행 완료.');
      return { status: 'success' };
    },
  },
};

module.exports = challengeJobs;
