const express = require('express');
const router = express.Router();

const { userController } = require('../controllers'); 
const {
  filterUserUpdateBody,
  isNotLogin,
} = require('../libs/middlewares');

router.get('/', isNotLogin, userController.getAllUsers);
router.get('/:userId', isNotLogin, userController.getUserById);

router.patch('/:userId', isNotLogin,filterUserUpdateBody, userController.updateUser);

router.delete('/:userId', isNotLogin, userController.deleteUser);

module.exports = router;
