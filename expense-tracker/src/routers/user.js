const express = require('express');

const router = express.Router();

const { userController } = require('../controllers');
const {
  filterUserUpdateBody,
  isLogin,
} = require('../libs/middlewares');

router.get('/', isLogin, userController.getAllUsers);
router.get('/:userId', isLogin, userController.getUserById);
router.patch('/:userId', isLogin, filterUserUpdateBody, userController.updateUserById);
router.delete('/:userId', isLogin, userController.deleteUserById);

module.exports = router;
