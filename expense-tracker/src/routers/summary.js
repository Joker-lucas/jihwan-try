const express = require('express');

const router = express.Router();

const { summaryController } = require('../controllers');
const {
  isLogin,
} = require('../libs/middlewares');

router.get('/monthly', isLogin, summaryController.getMonthlySummary);

module.exports = router;
