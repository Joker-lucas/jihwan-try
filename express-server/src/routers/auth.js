const express = require('express');
const router = express.Router();
const { authController } = require('../controllers'); 
const {
  validateSignup,
  filterSignupBody,
} = require('../libs/middlewares');

router.post('/sign-up', validateSignup, filterSignupBody, authController.signUp);

router.post('/sign-in', authController.signIn);

router.post('/sign-out', authController.signOut);

module.exports = router;