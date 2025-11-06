const express = require('express');
const { userLogController } = require('../controllers');
const { isLogin } = require('../libs/middlewares');

const router = express.Router();

router.get('/', isLogin, userLogController.getLogs);

module.exports = router;
