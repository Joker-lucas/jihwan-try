const express = require('express');
const router = express.Router();
const { userController } = require('../controllers'); 
const {
  filterUserUpdateBody,
  verifyToken,
} = require('../libs/middlewares');

router.get('/', verifyToken, userController.getAllUsers);
router.get('/:userId', verifyToken, userController.getUserById);

router.patch('/:userId', verifyToken, filterUserUpdateBody, userController.updateUser);

router.delete('/:userId', verifyToken, userController.deleteUser);

module.exports = router;