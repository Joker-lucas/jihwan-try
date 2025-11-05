const { challengeChecklistService } = require('../services');
const {
  response, error, authUtils, errorDefinition,
} = require('../libs/common');

const { successResponse } = response;
const { CustomError } = error;
const { ERROR_CODES } = errorDefinition;
const { isSelfOrAdmin, isAdmin } = authUtils;

const mapChallengeToPayload = (challenge) => {
  if (!challenge) return null;
  return {
    challengeId: challenge.challengeId,
    title: challenge.title,
    description: challenge.description,
    rewardXp: challenge.rewardXp,
    challengeStartDate: challenge.challengeStartDate,
    challengeExpireDate: challenge.challengeExpireDate,
    limitDay: challenge.limitDay,
  };
};

const mapChallengeChecklistToPayload = (checklist) => {
  if (!checklist) return null;
  return {
    challengeChecklistId: checklist.challengeChecklistId,
    userId: checklist.userId,
    challengeId: checklist.challengeId,
    status: checklist.status,
    userStartDate: checklist.userStartDate,
    userExpireDate: checklist.userExpireDate,
    completeDate: checklist.completeDate,
    challenge: checklist.Challenge ? mapChallengeToPayload(checklist.Challenge) : undefined,
  };
};

const createChallengeChecklist = async (req, res) => {
  const { userId } = req.user;
  const { challengeId } = req.body;

  const newChecklist = await challengeChecklistService.createChallengeChecklist(
    userId,
    challengeId,
  );
  successResponse(res, mapChallengeChecklistToPayload(newChecklist), 201);
};

const getChallengeChecklists = async (req, res) => {
  const requester = req.user;
  let targetUserId = requester.userId;

  if (isAdmin(requester) && req.query.userId) {
    targetUserId = req.query.userId;
  } else if
  (!isAdmin(requester) && req.query.userId && parseInt(req.query.userId, 10) !== requester.userId) {
    throw new CustomError(ERROR_CODES.FORBIDDEN);
  }

  const page = parseInt(req.query.page || 1, 10);
  const limit = parseInt(req.query.limit || 10, 10);
  const offset = (page - 1) * limit;

  const { totalItems, checklists } = await challengeChecklistService.getChallengeChecklists(
    targetUserId,
    limit,
    offset,
  );

  const checklistsPayload = checklists.map(mapChallengeChecklistToPayload);
  const totalPages = Math.ceil(totalItems / limit);

  successResponse(res, {
    checklists: checklistsPayload,
    pagination: {
      totalItems,
      totalPages,
      currentPage: page,
      limit,
    },
  });
};

const getChallengeChecklistById = async (req, res) => {
  const requester = req.user;
  const { challengeChecklistId } = req.params;

  const checklist = await challengeChecklistService.getChallengeChecklistById(challengeChecklistId);

  if (!isSelfOrAdmin(requester, checklist.userId)) {
    throw new CustomError(ERROR_CODES.FORBIDDEN);
  }

  successResponse(res, mapChallengeChecklistToPayload(checklist));
};

module.exports = {
  createChallengeChecklist,
  getChallengeChecklists,
  getChallengeChecklistById,
};
