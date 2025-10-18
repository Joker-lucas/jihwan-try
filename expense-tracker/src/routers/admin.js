const express = require('express');
const router = express.Router();

const { adminController } = require('../controllers'); 
const {
  filterUserUpdateBody,
  isLogin
} = require('../libs/middlewares');

router.get('/users', isLogin, adminController.getAllUsers);
router.get('/users/:userId', isLogin, adminController.getUserById);

router.patch('/users/:userId', isLogin, filterUserUpdateBody, adminController.updateUser);

router.delete('/users/:userId', isLogin, adminController.deleteUser);

router.route('/challenges')
    .get(isLogin, adminController.getAllChallenges)
    .post(isLogin, adminController.createChallenge);

router.route('/challenges/:challengeId')
    .patch(isLogin, adminController.updateChallenge)
    .delete(isLogin, adminController.deleteChallenge);

module.exports = router;