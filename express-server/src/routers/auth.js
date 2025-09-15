const express = require('express');
const router = express.Router();
const passport = require('passport');

const { authController } = require('../controllers'); 
const {
  validateSignupRequired,
  filterSignupBody,
  validateSignup,
  isLogin,
} = require('../libs/middlewares');

router.post('/sign-up', validateSignupRequired, validateSignup, filterSignupBody, authController.signUp);

router.post('/sign-in/cookie',passport.authenticate('local-cookie',{session: true}), authController.signIn);
router.post('/sign-in/jwt', passport.authenticate('local-cookie',{session: false}), authController.signIn);

router.post('/sign-out', isLogin, authController.signOut);


module.exports = router;