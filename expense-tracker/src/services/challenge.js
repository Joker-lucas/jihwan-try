const { Challenge, sequelize } = require('../libs/db/models');
const { CustomError } = require('../libs/common/error');
const { ERROR_CODES } = require('../libs/common/error-definition');

const createChallenge = async (challengeData) => {
  const newChallenge = await Challenge.create(challengeData);
  return newChallenge;
};

const getChallenges = async () => {
  const challenges = await Challenge.findAll({
    where: { deletedAt: null },
  });
  return challenges;
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
  const t = await sequelize.transaction();
  try {
    const challenge = await Challenge.findOne({ where: { challengeId, deletedAt: null } });
    if (!challenge) {
      throw new CustomError(ERROR_CODES.CHALLENGE_NOT_FOUND);
    }

    await challenge.update(updateData, { transaction: t });
    await t.commit();
    return challenge;
  } catch (e) {
    await t.rollback();
    throw e;
  }
};

const deleteChallenge = async (challengeId) => {
  const challenge = await Challenge.findOne({ where: { challengeId, deletedAt: null } });
  if (!challenge) {
    throw new CustomError(ERROR_CODES.CHALLENGE_NOT_FOUND);
  }

  await challenge.destroy;
  return true;
};

module.exports = {
  createChallenge,
  getChallenges,
  getChallengeById,
  updateChallenge,
  deleteChallenge,
};
