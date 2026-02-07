const { Op } = require('sequelize');
const {
  ChallengeChecklist, Challenge, Expense, Income,
} = require('../libs/db/models');
const { CustomError } = require('../libs/common/error');
const { ERROR_CODES } = require('../libs/common/error-definition');
const { challengeConstants } = require('../libs/constants');
const { getLogger } = require('../libs/logger');

const logger = getLogger('services/challenge-checklist.js');

const userLogService = require('./user-log');
const { LOG_CODES } = require('../libs/constants/user-log');

const createChallengeChecklist = async (userId, challengeId, context) => {
  try {
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

    let relativeExpireDate = null;
    let fixedExpireDate = null;

    if (challenge.limitDay && challenge.limitDay > 0) {
      const expireDate = new Date(today);
      expireDate.setDate(today.getDate() + challenge.limitDay);
      relativeExpireDate = expireDate;
    }
    if (challenge.challengeExpireDate) {
      fixedExpireDate = new Date(challenge.challengeExpireDate);
    }

    let finalUserExpireDate = null;

    if (relativeExpireDate && fixedExpireDate) {
      finalUserExpireDate = new Date(
        Math.min(
          relativeExpireDate.getTime(),
          fixedExpireDate.getTime(),
        ),
      );
    } else if (relativeExpireDate) {
      finalUserExpireDate = relativeExpireDate;
    } else if (fixedExpireDate) {
      finalUserExpireDate = fixedExpireDate;
    }
    const newChecklist = await ChallengeChecklist.create({
      userId,
      challengeId,
      status: challengeConstants.CHECKLIST_STATUS.PENDING,
      userStartDate: today,
      userExpireDate: finalUserExpireDate,
    });

    await userLogService.createLog({
      userId,
      actionType: LOG_CODES.CREATE_CHALLENGE_CHECKLIST,
      status: 'SUCCESS',
      details: { context, target: { challengeId } },
    });

    return newChecklist;
  } catch (e) {
    await userLogService.createLog({
      userId,
      actionType: LOG_CODES.CREATE_CHALLENGE_CHECKLIST,
      status: 'FAILURE',
      details: { context, target: { challengeId }, error: e.message },
    });
    throw e;
  }
};

const getChallengeChecklists = async (userId, page, limit) => {
  const offset = (page - 1) * limit;

  const { count, rows: checklists } = await ChallengeChecklist.findAndCountAll({
    where: { userId, deletedAt: null },
    include: [{
      model: Challenge,
      attributes: ['title', 'description', 'rewardXp', 'challengeType', 'targetValue', 'limitDay'],
    }],
    limit,
    offset,
  });
  return { totalCount: count, checklists };
};

const getChallengeChecklistById = async (challengeChecklistId, context) => {
  try {
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

    await userLogService.createLog({
      userId: context.userId,
      actionType: LOG_CODES.GET_CHALLENGE_CHECKLIST_DETAIL,
      status: 'SUCCESS',
      details: { context, target: { challengeChecklistId } },
    });

    return checklist;
  } catch (e) {
    await userLogService.createLog({
      userId: context.userId,
      actionType: LOG_CODES.GET_CHALLENGE_CHECKLIST_DETAIL,
      status: 'FAILURE',
      details: { context, target: { challengeChecklistId }, error: e.message },
    });
    throw e;
  }
};

const _getChallengePeriod = (checklist) => {
  const userStartDate = new Date(checklist.userStartDate);
  const finalStartDate = userStartDate;
  let finalExpireDate = null;

  if (checklist.userExpireDate) {
    finalExpireDate = new Date(checklist.userExpireDate);
  }

  return { startDate: finalStartDate, expireDate: finalExpireDate };
};

const _checkSuccessJudgment = async (checklist, challenge) => {
  const { userId } = checklist;

  const { challengeType, targetValue } = challenge;

  const { startDate, expireDate } = _getChallengePeriod(checklist, challenge);

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
      return trueValue >= targetValue;

    case challengeConstants.CHALLENGE_TYPE.EXPENSE_COUNT_LESS:
      trueValue = await Expense.count({ where: periodCondition });
      return trueValue <= targetValue;

    case challengeConstants.CHALLENGE_TYPE.INCOME_COUNT_MORE:
      trueValue = await Income.count({ where: periodCondition });
      return trueValue >= targetValue;

    case challengeConstants.CHALLENGE_TYPE.INCOME_COUNT_LESS:
      trueValue = await Income.count({ where: periodCondition });
      return trueValue <= targetValue;

    case challengeConstants.CHALLENGE_TYPE.EXPENSE_TOTAL_AMOUNT_MORE:
      trueValue = (await Expense.sum('amount', { where: periodCondition })) || 0;
      return trueValue >= targetValue;

    case challengeConstants.CHALLENGE_TYPE.EXPENSE_TOTAL_AMOUNT_LESS:
      trueValue = (await Expense.sum('amount', { where: periodCondition })) || 0;
      return trueValue <= targetValue;

    case challengeConstants.CHALLENGE_TYPE.INCOME_TOTAL_AMOUNT_MORE:
      trueValue = (await Income.sum('amount', { where: periodCondition })) || 0;
      return trueValue >= targetValue;

    case challengeConstants.CHALLENGE_TYPE.INCOME_TOTAL_AMOUNT_LESS:
      trueValue = (await Income.sum('amount', { where: periodCondition })) || 0;
      return trueValue <= targetValue;

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

  const tasks = checklists.map(async (checklist) => {
    const { Challenge: challenge } = checklist;
    const { expireDate } = _getChallengePeriod(checklist, challenge);

    if (expireDate) {
      const isExpired = expireDate && expireDate < today;

      if (!isExpired) {
        return;
      }

      const isSuccess = await _checkSuccessJudgment(checklist, challenge);
      if (isSuccess) {
        await updateChecklistStatus(checklist.challengeChecklistId, {
          status: challengeConstants.CHECKLIST_STATUS.COMPLETED,
          completeDate: today,
        });
        return;
      }

      await updateChecklistStatus(checklist.challengeChecklistId, {
        status: challengeConstants.CHECKLIST_STATUS.FAILED,
      });
      return;
    }

    const isSuccess = await _checkSuccessJudgment(checklist, challenge);
    if (isSuccess) {
      await updateChecklistStatus(checklist.challengeChecklistId, {
        status: challengeConstants.CHECKLIST_STATUS.COMPLETED,
        completeDate: today,
      });
    }
  });

  const results = await Promise.allSettled(tasks);

  results.forEach((result) => {
    if (result.status === 'rejected') {
      logger.error(result.reason, '체크리스트 상태 업데이트 중 오류가 발생했습니다.');
    }
  });
};
module.exports = {
  createChallengeChecklist,
  getChallengeChecklists,
  getChallengeChecklistById,

  intervalChecklistStatusUpdateJob,
};
