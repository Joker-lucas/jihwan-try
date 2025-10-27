const express = require('express');

const router = express.Router();

const { reportController } = require('../controllers');
const {
  isLogin,
} = require('../libs/middlewares');

router.get('/monthly', isLogin, reportController.getMonthlyReport);

module.exports = router;
