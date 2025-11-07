const express = require('express');

const router = express.Router();

const { challengeChecklistController } = require('../controllers');
const {
  isLogin,
} = require('../libs/middlewares');

router.get('/', isLogin, challengeChecklistController.getChallengeChecklists);
router.post('/', isLogin, challengeChecklistController.createChallengeChecklist);
router.get('/:challengeChecklistId', isLogin, challengeChecklistController.getChallengeChecklistById);

module.exports = router;
