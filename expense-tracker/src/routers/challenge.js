const express = require('express');

const router = express.Router();

const { challengeController, challengeChecklistController } = require('../controllers');
const {
  isLogin,
  validateChallengeRequired,
  filterChallengeBody,
  validateChallengeData,
} = require('../libs/middlewares');

router.post('/', isLogin, validateChallengeRequired, filterChallengeBody, validateChallengeData, challengeController.createChallenge);
router.get('/', isLogin, challengeController.getChallenges);
router.get('/:challengeId', isLogin, challengeController.getChallengeById);
router.patch('/:challengeId', isLogin, filterChallengeBody, validateChallengeData, challengeController.updateChallenge);
router.delete('/:challengeId', isLogin, challengeController.deleteChallenge);

router.post('/:challengeId/checklists', isLogin, challengeChecklistController.createChallengeChecklist);
router.get('/checklists', isLogin, challengeChecklistController.getChallengeChecklists);
router.get('/checklists/:challengeChecklistId', isLogin, challengeChecklistController.getChallengeChecklistById);

module.exports = router;
