const express = require('express');
const router = express.Router();
const passport = require('passport');

const { authController } = require('../controllers'); 
const {
  validateSignupRequired,
  filterSignupBody,
  validateSignup,
  isLogin,
  isNotLogin
} = require('../libs/middlewares');

router.post('/sign-up', isLogin, validateSignupRequired, validateSignup, filterSignupBody, authController.signUp);

router.post('/sign-in/cookie',isLogin, passport.authenticate('local-cookie',{session: true}), authController.signIn);
router.post('/sign-in/jwt', isLogin, passport.authenticate('local-cookie',{session: false}), authController.signIn);

router.post('/sign-out', isNotLogin, authController.signOut);


module.exports = router;