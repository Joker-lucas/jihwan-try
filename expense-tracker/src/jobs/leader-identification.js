const { randomUUID } = require('crypto');
const { getRedisClient } = require('../libs/redis');
const { getLogger } = require('../libs/logger');

const logger = getLogger('src/jobs/leader-identification.js');

const LEADER_KEY = 'leader';
const LEADER_TTL_SECONDS = 30;
const REFRESH_INTERVAL_MS = 10 * 1000;

const serverId = randomUUID();
let isThisServerLeader = false;
let leadershipInterval = null;

const redis = getRedisClient();

const updateLeader = async () => {
  try {
    const result = await redis.set(LEADER_KEY, serverId, {
      EX: LEADER_TTL_SECONDS,
      NX: true,
    });

    if (result === 'OK') {
      if (!isThisServerLeader) {
        logger.info(`새로운 리더가 되었습니다. 서버 ID: ${serverId}`);
      }
      isThisServerLeader = true;
      return;
    }

    const currentLeader = await redis.get(LEADER_KEY);

    if (currentLeader === serverId) {
      await redis.expire(LEADER_KEY, LEADER_TTL_SECONDS);
      isThisServerLeader = true;
    } else if (isThisServerLeader) {
      isThisServerLeader = false;
    }
  } catch (error) {
    isThisServerLeader = false;
    logger.error('리더 획득/갱신 중 오류 발생:', error);
  }
};

const initializeLeaderIdentification = () => {
  if (leadershipInterval) {
    clearInterval(leadershipInterval);
  }
  logger.info(`리더 확인 프로세스를 시작. 서버 ID: ${serverId}`);
  updateLeader();
  leadershipInterval = setInterval(updateLeader, REFRESH_INTERVAL_MS);
};

const stopLeaderIdentification = () => {
  if (leadershipInterval) {
    clearInterval(leadershipInterval);
    leadershipInterval = null;
    logger.info('리더 확인 프로세스를 중지.');
  }
};

const isLeader = () => isThisServerLeader;

module.exports = {
  initializeLeaderIdentification,
  stopLeaderIdentification,
  isLeader,
};
