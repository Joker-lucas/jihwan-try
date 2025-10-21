const express = require('express');
const router = express.Router();

const { userController, challengeController } = require('../controllers'); 
const {
  filterUserUpdateBody,
  isLogin
} = require('../libs/middlewares');

router.get('/users', isLogin, userController.getAllUsers);
router.get('/users/:userId', isLogin, userController.getUserById);

router.patch('/users/:userId', isLogin, filterUserUpdateBody, userController.updateUserById);

router.delete('/users/:userId', isLogin, userController.deleteUserById);

router.route('/challenges')
    .get(isLogin, challengeController.getAllChallenges)
    .post(isLogin, challengeController.createChallenge);

router.route('/challenges/:challengeId')
    .patch(isLogin, challengeController.updateChallenge)
    .delete(isLogin, challengeController.deleteChallenge);

module.exports = router;