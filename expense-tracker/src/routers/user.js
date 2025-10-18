const express = require('express');
const router = express.Router();

const { userController,challengeController } = require('../controllers'); 
const {
  filterUserUpdateBody,
  isLogin
} = require('../libs/middlewares');

router.get('/me', isLogin, userController.getMyProfile);

router.patch('/me', isLogin, filterUserUpdateBody, userController.updateMyProfile);

router.get('/me/challenges', isLogin, challengeController.getMyChallengeStatus);

module.exports = router;
