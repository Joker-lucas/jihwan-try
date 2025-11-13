const { challengeService } = require('../services');
const { userLogService } = require('../services/user-log');
const {
  response, error, authUtils, errorDefinition,
} = require('../libs/common');
const { LOG_CODES } = require('../libs/constants/user-log');

const { successResponse } = response;
const { CustomError } = error;
const { ERROR_CODES } = errorDefinition;
const { isAdmin } = authUtils;

const mapChallengeToPayload = (challenge) => ({
  challengeId: challenge.challengeId,
  title: challenge.title,
  description: challenge.description,
  rewardXp: challenge.rewardXp,
  challengeStartDate: challenge.challengeStartDate,
  challengeExpireDate: challenge.challengeExpireDate,
  limitDay: challenge.limitDay,
});

const createChallenge = async (req, res) => {
  const requester = req.user;
  const context = {
    method: req.method,
    url: req.originalUrl,
  };
  try {
    if (!isAdmin(requester)) {
      throw new CustomError(ERROR_CODES.FORBIDDEN);
    }
    const challengeData = req.body;
    const newChallenge = await challengeService.createChallenge(challengeData);

    await userLogService.createLog({
      userId: requester.userId,
      actionType: LOG_CODES.CREATE_CHALLENGE,
      status: 'SUCCESS',
      details: {
        context,
        actor: { id: requester.userId, email: requester.contactEmail },
        body: { title: newChallenge.title },
      },
    });

    successResponse(res, mapChallengeToPayload(newChallenge), 201);
  } catch (e) {
    await userLogService.createLog({
      userId: requester.userId,
      actionType: LOG_CODES.CREATE_CHALLENGE,
      status: 'FAILURE',
      details: {
        context,
        actor: { id: requester.userId, email: requester.contactEmail },
        body: { title: req.body.title },
        error: e.message,
      },
    });
    throw e;
  }
};

const getChallenges = async (req, res) => {
  const page = parseInt(req.query.page, 10);
  const limit = parseInt(req.query.limit, 10);

  const { totalItems, challenges } = await challengeService.getChallenges({ limit, page });

  const challengesPayload = challenges.map(mapChallengeToPayload);

  successResponse(res, {
    challenges: challengesPayload,
    totalItems,
  });
};

const getChallengeById = async (req, res) => {
  const { challengeId } = req.params;
  const challenge = await challengeService.getChallengeById(challengeId);

  if (!challenge) {
    throw new CustomError(ERROR_CODES.CHALLENGE_NOT_FOUND);
  }
  successResponse(res, mapChallengeToPayload(challenge));
};

const updateChallenge = async (req, res) => {
  const requester = req.user;
  const { challengeId } = req.params;
  const context = {
    method: req.method,
    url: req.originalUrl,
  };
  try {
    if (!isAdmin(requester)) {
      throw new CustomError(ERROR_CODES.FORBIDDEN);
    }
    if (!challengeId) {
      throw new CustomError(ERROR_CODES.CHALLENGE_NOT_FOUND);
    }
    const updateData = req.body;
    const updatedChallenge = await challengeService.updateChallenge(challengeId, updateData);

    await userLogService.createLog({
      userId: requester.userId,
      actionType: LOG_CODES.UPDATE_CHALLENGE,
      status: 'SUCCESS',
      details: {
        context,
        actor: { id: requester.userId, email: requester.contactEmail },
        target: { challengeId },
      },
    });

    successResponse(res, mapChallengeToPayload(updatedChallenge));
  } catch (e) {
    await userLogService.createLog({
      userId: requester.userId,
      actionType: LOG_CODES.UPDATE_CHALLENGE,
      status: 'FAILURE',
      details: {
        context,
        actor: { id: requester.userId, email: requester.contactEmail },
        target: { challengeId },
        error: e.message,
      },
    });
    throw e;
  }
};

module.exports = {
  createChallenge,
  getChallenges,
  getChallengeById,
  updateChallenge,
};
