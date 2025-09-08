const express = require('express');
const router = express.Router();
const { userController } = require('../controllers'); 
const {
  validateSignup,
  filterSignupBody,
  filterUserUpdateBody,
} = require('../libs/middlewares');


router.get('/', userController.getAllUsers);
router.get('/:userId', userController.getUserById);

router.post('/', validateSignup, filterSignupBody, userController.createUser);

router.patch('/:userId', filterUserUpdateBody, userController.updateUser);

router.delete('/:userId', userController.deleteUser);

module.exports = router;