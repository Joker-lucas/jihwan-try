const { Op } = require('sequelize');
const {
  ChallengeChecklist, Challenge, Expense, Income,
} = require('../libs/db/models');
const { CustomError } = require('../libs/common/error');
const { ERROR_CODES } = require('../libs/common/error-definition');
const { challengeConstants } = require('../libs/constants');

const createChallengeChecklist = async (userId, challengeId) => {
  const challenge = await Challenge.findOne({ where: { challengeId, deletedAt: null } });
  if (!challenge) {
    throw new CustomError(ERROR_CODES.CHALLENGE_NOT_FOUND);
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (challenge.challengeStartDate) {
    const challengeStartDate = new Date(challenge.challengeStartDate);
    if (today < challengeStartDate) {
      throw new CustomError(ERROR_CODES.CHALLENGE_NOT_STARTED);
    }
  }
  if (challenge.challengeExpireDate) {
    const challengeExpireDate = new Date(challenge.challengeExpireDate);
    if (today > challengeExpireDate) {
      throw new CustomError(ERROR_CODES.CHALLENGE_EXPIRED);
    }
  }
  const existingChecklist = await ChallengeChecklist.findOne({
    where: { userId, challengeId, deletedAt: null },
  });

  if (existingChecklist) {
    throw new CustomError(ERROR_CODES.CHECKLIST_ALREADY_EXISTS);
  }

  let userExpireDate = null;
  if (challenge.limitDay && challenge.limitDay > 0) {
    const expireDate = new Date(today);
    expireDate.setDate(today.getDate() + challenge.limitDay);
    userExpireDate = expireDate;
  }

  const newChecklist = await ChallengeChecklist.create({
    userId,
    challengeId,
    status: challengeConstants.CHECKLIST_STATUS.PENDING,
    userStartDate: today,
    userExpireDate,
  });

  return newChecklist;
};

const getChallengeChecklists = async (userId, limit, offset) => {
  const { count, rows: checklists } = await ChallengeChecklist.findAndCountAll({
    where: { userId, deletedAt: null },
    include: [{
      model: Challenge,
      attributes: ['title', 'description', 'rewardXp', 'challengeType', 'targetValue', 'limitDay'],
    }],
    limit,
    offset,
  });
  return { totalItems: count, checklists };
};

const getChallengeChecklistById = async (challengeChecklistId) => {
  const checklist = await ChallengeChecklist.findOne({
    where: { challengeChecklistId, deletedAt: null },
    include: [{
      model: Challenge,
      attributes: ['title', 'description', 'rewardXp', 'challengeType', 'targetValue', 'limitDay'],
    }],
  });

  if (!checklist) {
    throw new CustomError(ERROR_CODES.CHALLENGE_CHECKLIST_NOT_FOUND);
  }

  return checklist;
};

const _getChallengePeriod = (checklist) => {
  const challengeData = checklist.Challenge;

  const userStartDate = new Date(checklist.userStartDate);

  let finalStartDate = userStartDate;
  let finalExpireDate = null;

  if (checklist.userExpireDate) {
    finalExpireDate = new Date(checklist.userExpireDate);
  } else if (challengeData.challengeExpireDate) {
    finalExpireDate = new Date(challengeData.challengeExpireDate);
  }

  if (challengeData.challengeStartDate) {
    const fixStartDate = new Date(challengeData.challengeStartDate);

    if (fixStartDate > userStartDate) {
      finalStartDate = fixStartDate;
    }
  }
  return { startDate: finalStartDate, expireDate: finalExpireDate };
};

const _checkSuccessJudgment = async (checklist) => {
  const { userId } = checklist;
  const challengeData = checklist.Challenge;

  const { challengeType } = challengeData;
  const { targetValue } = challengeData;

  const { startDate, expireDate } = _getChallengePeriod(checklist);

  const periodCondition = {
    userId,
    date: {},
    deletedAt: null,
  };

  periodCondition.date[Op.gte] = startDate;

  if (expireDate) {
    periodCondition.date[Op.lte] = expireDate;
  }
  let trueValue = 0;

  switch (challengeType) {
    case challengeConstants.CHALLENGE_TYPE.EXPENSE_COUNT_MORE:
      trueValue = await Expense.count({ where: periodCondition });
      return trueValue > targetValue;

    case challengeConstants.CHALLENGE_TYPE.EXPENSE_COUNT_LESS:
      trueValue = await Expense.count({ where: periodCondition });
      return trueValue < targetValue;

    case challengeConstants.CHALLENGE_TYPE.INCOME_COUNT_MORE:
      trueValue = await Income.count({ where: periodCondition });
      return trueValue > targetValue;

    case challengeConstants.CHALLENGE_TYPE.INCOME_COUNT_LESS:
      trueValue = await Income.count({ where: periodCondition });
      return trueValue < targetValue;

    case challengeConstants.CHALLENGE_TYPE.EXPENSE_TOTAL_AMOUNT_MORE:
      trueValue = await Expense.sum('amount', { where: periodCondition }) || 0;
      return trueValue > targetValue;

    case challengeConstants.CHALLENGE_TYPE.EXPENSE_TOTAL_AMOUNT_LESS:
      trueValue = await Expense.sum('amount', { where: periodCondition }) || 0;
      return trueValue < targetValue;

    case challengeConstants.CHALLENGE_TYPE.INCOME_TOTAL_AMOUNT_MORE:
      trueValue = await Income.sum('amount', { where: periodCondition }) || 0;
      return trueValue > targetValue;

    case challengeConstants.CHALLENGE_TYPE.INCOME_TOTAL_AMOUNT_LESS:
      trueValue = await Income.sum('amount', { where: periodCondition }) || 0;
      return trueValue < targetValue;

    default: return false;
  }
};

const getPendingChecklistsForUpdate = async () => {
  const checklists = await ChallengeChecklist.findAll({
    where: {
      status: challengeConstants.CHECKLIST_STATUS.PENDING,
      deletedAt: null,
    },
    attributes: ['challengeChecklistId', 'userId', 'status', 'userStartDate', 'userExpireDate'],
    include: [{
      model: Challenge,
      attributes: ['challengeStartDate', 'challengeExpireDate', 'challengeType', 'targetValue', 'limitDay'],
    }],
  });
  return checklists;
};

const updateChecklistStatus = async (challengeChecklistId, updateData) => {
  const checklist = await ChallengeChecklist.findOne({
    where: { challengeChecklistId },
  });
  if (!checklist) {
    throw new CustomError(ERROR_CODES.CHALLENGE_CHECKLIST_NOT_FOUND);
  }
  await checklist.update(updateData);
  return checklist;
};

const intervalChecklistStatusUpdateJob = async () => {
  const checklists = await getPendingChecklistsForUpdate();

  if (checklists.length === 0) {
    return;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  // eslint-disable-next-line no-restricted-syntax
  for (const checklist of checklists) {
    const { expireDate } = _getChallengePeriod(checklist);

    if (expireDate && expireDate < today) {
      // eslint-disable-next-line no-await-in-loop
      await updateChecklistStatus(
        checklist.challengeChecklistId,
        { status: challengeConstants.CHECKLIST_STATUS.FAILED },
      );
      // eslint-disable-next-line no-continue
      continue;
    }
    if (checklist.Challenge.challengeType) {
      // eslint-disable-next-line no-await-in-loop
      const isSuccess = await _checkSuccessJudgment(checklist);

      if (isSuccess) {
        // eslint-disable-next-line no-await-in-loop
        await updateChecklistStatus(
          checklist.challengeChecklistId,
          {
            status: challengeConstants.CHECKLIST_STATUS.COMPLETED,
            completeDate: today,
          },
        );
      }
    }
  }
};

module.exports = {
  createChallengeChecklist,
  getChallengeChecklists,
  getChallengeChecklistById,

  intervalChecklistStatusUpdateJob,
};
