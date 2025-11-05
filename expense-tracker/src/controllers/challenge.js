const { challengeService } = require('../services');
const {
  response, error, authUtils, errorDefinition,
} = require('../libs/common');

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
  if (!isAdmin(req.user)) {
    throw new CustomError(ERROR_CODES.FORBIDDEN);
  }
  const challengeData = req.body;
  const newChallenge = await challengeService.createChallenge(challengeData);
  successResponse(res, mapChallengeToPayload(newChallenge), 201);
};

const getChallenges = async (req, res) => {
  const page = parseInt(req.query.page || 1, 10);
  const limit = parseInt(req.query.limit || 10, 10);
  const offset = (page - 1) * limit;

  const { totalItems, challenges } = await challengeService.getChallenges({ limit, offset });

  const challengesPayload = challenges.map(mapChallengeToPayload);
  const totalPages = Math.ceil(totalItems / limit);

  successResponse(res, {
    challenges: challengesPayload,
    pagination: {
      totalItems,
      totalPages,
      currentPage: page,
      limit,
    },
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
  if (!isAdmin(req.user)) {
    throw new CustomError(ERROR_CODES.FORBIDDEN);
  }
  const { challengeId } = req.params;
  if (!challengeId) {
    throw new CustomError(ERROR_CODES.CHALLENGE_NOT_FOUND);
  }
  const updateData = req.body;
  const updatedChallenge = await challengeService.updateChallenge(challengeId, updateData);
  successResponse(res, mapChallengeToPayload(updatedChallenge));
};

module.exports = {
  createChallenge,
  getChallenges,
  getChallengeById,
  updateChallenge,
};
