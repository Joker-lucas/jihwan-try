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
  challengeEndDate: challenge.challengeEndDate,
  limitTime: challenge.limitTime,
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
  const challenges = await challengeService.getChallenges();
  const challengesPayload = challenges.map(mapChallengeToPayload);
  successResponse(res, challengesPayload);
};

const getChallengeById = async (req, res) => {
  const { challengeId } = req.params;
  const challenge = await challengeService.getChallengeById(challengeId);
  successResponse(res, mapChallengeToPayload(challenge));
};

const updateChallenge = async (req, res) => {
  if (!isAdmin(req.user)) {
    throw new CustomError(ERROR_CODES.FORBIDDEN);
  }
  const { challengeId } = req.params;
  const updateData = req.body;
  const updatedChallenge = await challengeService.updateChallenge(challengeId, updateData);
  successResponse(res, mapChallengeToPayload(updatedChallenge));
};

const deleteChallenge = async (req, res) => {
  if (!isAdmin(req.user)) {
    throw new CustomError(ERROR_CODES.FORBIDDEN);
  }
  const { challengeId } = req.params;
  await challengeService.deleteChallenge(challengeId);
  successResponse(res, { message: 'Challenge deleted successfully' });
};

module.exports = {
  createChallenge,
  getChallenges,
  getChallengeById,
  updateChallenge,
  deleteChallenge,
};
