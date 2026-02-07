const { Challenge } = require('../libs/db/models');
const { CustomError } = require('../libs/common/error');
const { ERROR_CODES } = require('../libs/common/error-definition');

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
  return { totalCount: count, challenges };
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
};
