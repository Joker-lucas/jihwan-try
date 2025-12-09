const express = require('express');

const router = express.Router();

const { challengeController } = require('../controllers');
const {
  isLogin,
  validateChallengeRequired,
  filterChallengeBody,
  validateChallengeData,
  cache,
} = require('../libs/middlewares');

router.post('/', isLogin, validateChallengeRequired, filterChallengeBody, validateChallengeData, challengeController.createChallenge);
router.get('/', isLogin, cache, challengeController.getChallenges);
router.get('/:challengeId', isLogin, challengeController.getChallengeById);
router.patch('/:challengeId', isLogin, filterChallengeBody, validateChallengeData, challengeController.updateChallenge);

module.exports = router;
