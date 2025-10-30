const { ChallengeChecklist, Challenge } = require('../libs/db/models');
const { sequelize } = require('../libs/db');
const { CustomError } = require('../libs/common/error');
const { ERROR_CODES } = require('../libs/common/error-definition');

const createChallengeChecklist = async (userId, challengeId) => {
  const t = await sequelize.transaction();
  try {
    const challenge = await Challenge.findOne({ where: { challengeId, deletedAt: null } });
    if (!challenge) {
      throw new CustomError(ERROR_CODES.CHALLENGE_NOT_FOUND);
    }

    const newChecklist = await ChallengeChecklist.create({
      userId,
      challengeId,
      status: 'PENDING',
    }, { transaction: t });

    await t.commit();
    return newChecklist;
  } catch (e) {
    await t.rollback();
    throw e;
  }
};

const getChallengeChecklists = async (userId) => {
  const checklists = await ChallengeChecklist.findAll({
    where: { userId, deletedAt: null },
    include: [{
      model: Challenge,
      attributes: ['title', 'description', 'rewardXp'],
    }],
  });
  return checklists;
};

const getChallengeChecklistById = async (challengeChecklistId) => {
  const checklist = await ChallengeChecklist.findOne({
    where: { challengeChecklistId, deletedAt: null },
    include: [{
      model: Challenge,
      attributes: ['title', 'description', 'rewardXp'],
    }],
  });
  return checklist;
};

const updateChallengeChecklistStatus = async (challengeChecklistId, status) => {

};

module.exports = {
  createChallengeChecklist,
  getChallengeChecklists,
  getChallengeChecklistById,
  updateChallengeChecklistStatus,
};
