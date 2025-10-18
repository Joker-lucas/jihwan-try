const express = require('express');
const router = express.Router();

const { challengeController } = require('../controllers');
const {
  isLogin
} = require('../libs/middlewares');

router.get('/', isLogin, challengeController.getAllChallenges);

module.exports = router;