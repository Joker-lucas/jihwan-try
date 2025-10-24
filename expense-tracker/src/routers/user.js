const express = require('express');
const router = express.Router();

const { userController,challengeController } = require('../controllers'); 
const {
  filterUserUpdateBody,
  isLogin
} = require('../libs/middlewares');


router.get('/', isLogin, userController.getAllUsers);
router.get('/:userId', isLogin, userController.getUserById);
router.patch('/:userId', isLogin, filterUserUpdateBody, userController.updateUserById);
router.delete('/:userId', isLogin, userController.deleteUserById);

router.get('/:userId/challenges', isLogin, challengeController.getChallengeStatus);

module.exports = router;
