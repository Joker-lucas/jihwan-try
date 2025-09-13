const express = require('express');
const router = express.Router();
const passport = require('passport');
const { userController } = require('../controllers'); 
const {
  filterUserUpdateBody,
} = require('../libs/middlewares');

router.get('/', passport.authenticate('jwt', { session: false }), userController.getAllUsers);
router.get('/:userId', passport.authenticate('jwt', { session: false }), userController.getUserById);

router.patch('/:userId', passport.authenticate('jwt', { session: false }), filterUserUpdateBody, userController.updateUser);

router.delete('/:userId', passport.authenticate('jwt', { session: false }), userController.deleteUser);

module.exports = router;
