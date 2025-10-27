const express = require('express');

const router = express.Router();

const { challengeController } = require('../controllers');
const {
  isLogin,
} = require('../libs/middlewares');

router.get('/', isLogin, challengeController.getAllChallenges);

router.post('/', isLogin, challengeController.createChallenge);

router.patch('/:challengeId', isLogin, challengeController.updateChallenge);

router.delete('/:challengeId', isLogin, challengeController.deleteChallenge);

module.exports = router;
