const express = require('express');
const router = express.Router();
const { userController } = require('../controllers'); 
const {
  validateUserCreation,
  filterUserCreateBody,
  filterUserUpdateBody,
} = require('../libs/middlewares');


router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', validateUserCreation, filterUserCreateBody, userController.createUser); 
router.put('/:id', filterUserUpdateBody, userController.updateUser);
router.patch('/:id', filterUserUpdateBody, userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;