const { userService } = require('../services'); 
const { response, error, errorDefinition } = require('../libs/common');
const { successResponse } = response;
const { CustomError } = error;
const { ERROR_CODES } = errorDefinition;

const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    successResponse(res, users);
  } catch (error) {
    throw error;
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.userId);
    if (!user) {
      throw new CustomError(ERROR_CODES.USER_NOT_FOUND);
    }
    successResponse(res, user);
  } catch (error) {
    throw error;
  }
};

const updateUser = async (req, res) => {
  try {
    const updatedUser = await userService.updateUserById(req.params.userId, req.body);
    if (!updatedUser) {
      throw new CustomError(ERROR_CODES.USER_NOT_FOUND);
    }
    successResponse(res, updatedUser);
  } catch (error) {
    throw error;
  }
};

const deleteUser = async (req, res) => {
  try {
    const isDeleted = await userService.deleteUserById(req.params.userId);
    if (!isDeleted) {
      throw new CustomError(ERROR_CODES.USER_NOT_FOUND);
    }
    successResponse(res, { message: '성공적으로 삭제되었습니다.' });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};