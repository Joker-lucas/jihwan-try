const express = require('express');

const router = express.Router();

const { reportController } = require('../controllers');
const {
  isLogin,
} = require('../libs/middlewares');

router.get('/', isLogin, reportController.getReports);

module.exports = router;
