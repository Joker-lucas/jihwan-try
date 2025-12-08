const { redisClient } = require('../libs/redis');
const { Challenge } = require('../libs/db/models');
const { CustomError } = require('../libs/common/error');
const { ERROR_CODES } = require('../libs/common/error-definition');
const { challengeConstants } = require('../libs/constants');
const { getLogger } = require('../libs/logger');

const logger = getLogger('services/challenge.js');

const _calculateLimitDay = (startDateStr, expireDateStr) => {
  if (startDateStr && expireDateStr) {
    const [startY, startM, startD] = startDateStr.split('-').map(Number);
    const [expireY, expireM, expireD] = expireDateStr.split('-').map(Number);

    const utcStartDate = new Date(Date.UTC(startY, startM - 1, startD));
    const utcExpireDate = new Date(Date.UTC(expireY, expireM - 1, expireD));

    if (utcExpireDate < utcStartDate) {
      throw new CustomError(ERROR_CODES.INVALID_DATE_RANGE);
    }
    const ONE_DAY_MS = 1000 * 60 * 60 * 24;

    const diffMs = utcExpireDate.getTime() - utcStartDate.getTime();

    const diffDays = diffMs / ONE_DAY_MS;

    return diffDays + 1;
  }

  return null;
};

const createChallenge = async (challengeData) => {
  const dataToCreate = { ...challengeData };
  if (dataToCreate.challengeStartDate && dataToCreate.challengeExpireDate) {
    dataToCreate.limitDay = _calculateLimitDay(
      dataToCreate.challengeStartDate,
      dataToCreate.challengeExpireDate,
    );
  }

  const newChallenge = await Challenge.create(dataToCreate);
  return newChallenge;
};

const getChallenges = async ({ limit, page }) => {
  const offset = (page - 1) * limit;

  const { count, rows: challenges } = await Challenge.findAndCountAll({
    where: { deletedAt: null },
    order: [['challengeId', 'DESC']],
    limit,
    offset,
  });
  return { totalItems: count, challenges };
};

const getChallengeById = async (challengeId) => {
  const challenge = await Challenge.findOne({
    where: { challengeId, deletedAt: null },
  });
  if (!challenge) {
    throw new CustomError(ERROR_CODES.CHALLENGE_NOT_FOUND);
  }
  return challenge;
};

const refreshChallengesCache = async () => {
  logger.info('챌린지 캐시 갱신 서비스 실행 시작.');
  const CACHE_TTL_SECONDS = 350;

  try {
    const cacheKeyAll = 'challenges:all';
    const { count: totalChallengesCount, rows: challengesAll } = await Challenge.findAndCountAll({
      where: { deletedAt: null },
      order: [['challengeId', 'DESC']],
    });
    const resultAll = { totalItems: totalChallengesCount, challenges: challengesAll };
    await redisClient.set(cacheKeyAll, JSON.stringify(resultAll), 'EX', CACHE_TTL_SECONDS);
    logger.info(`모든 챌린지 캐시 갱신 완료. (총 ${totalChallengesCount}개)`);

    const limitsToCache = challengeConstants.CHALLENGE_PREWARM_LIMITS;

    for (const limit of limitsToCache) {
      if (totalChallengesCount > 0) {
        const totalPages = Math.ceil(totalChallengesCount / limit);
        logger.info(`Limit ${limit}에 대해 ${totalPages}개의 페이지 캐싱 시작.`);

        for (let page = 1; page <= totalPages; page += 1) {
          const cacheKey = `challenges:page:${page}:limit:${limit}`;
          const offset = (page - 1) * limit;

          const { count, rows: challenges } = await Challenge.findAndCountAll({
            where: { deletedAt: null },
            order: [['challengeId', 'DESC']],
            limit,
            offset,
          });
          const result = { totalItems: count, challenges };
          await redisClient.set(cacheKey, JSON.stringify(result), 'EX', CACHE_TTL_SECONDS);
        }
        logger.info(`Limit ${limit}에 대한 ${totalPages}개 페이지 캐싱 완료.`);
      } else {
        logger.info(`총 챌린지가 없어 limit ${limit}에 대한 페이지 캐싱을 건너뜁니다.`);
      }
    }

    return { status: 'success' };
  } catch (error) {
    logger.error(`챌린지 캐시 갱신 서비스 실패: ${error.message}`, error);
    throw error;
  }
};

const updateChallenge = async (challengeId, updateData) => {
  const challenge = await Challenge.findOne({ where: { challengeId, deletedAt: null } });
  if (!challenge) {
    throw new CustomError(ERROR_CODES.CHALLENGE_NOT_FOUND);
  }
  const dataToUpdate = { ...updateData };

  const wasInfinite = !challenge.challengeExpireDate && !challenge.limitDay;

  const isTryingToAddExpire = dataToUpdate.challengeExpireDate !== undefined
  || dataToUpdate.limitDay !== undefined;

  if (wasInfinite && isTryingToAddExpire) {
    throw new CustomError(ERROR_CODES.BAD_REQUEST);
  }

  const isDateChanging = dataToUpdate.challengeStartDate !== undefined
  || dataToUpdate.challengeExpireDate !== undefined;

  if (dataToUpdate.challengeExpireDate && challenge.challengeExpireDate) {
    const newExpireDate = new Date(dataToUpdate.challengeExpireDate);
    const oldExpireDate = new Date(challenge.challengeExpireDate);

    if (newExpireDate < oldExpireDate) {
      throw new CustomError(ERROR_CODES.BAD_REQUEST);
    }
  }
  if (isDateChanging) {
    const finalStartDate = dataToUpdate.challengeStartDate !== undefined
      ? dataToUpdate.challengeStartDate
      : challenge.challengeStartDate;

    const finalExpireDate = dataToUpdate.challengeExpireDate !== undefined
      ? dataToUpdate.challengeExpireDate
      : challenge.challengeExpireDate;

    dataToUpdate.limitDay = _calculateLimitDay(finalStartDate, finalExpireDate);
  }

  await challenge.update(dataToUpdate);
  return challenge;
};
module.exports = {
  createChallenge,
  getChallenges,
  getChallengeById,
  updateChallenge,
  refreshChallengesCache,
};
