const express = require('express');

const router = express.Router();

const { weatherController } = require('../controllers');
const { isLogin } = require('../libs/middlewares');

router.get('/', isLogin, weatherController.getWeather);

module.exports = router;
