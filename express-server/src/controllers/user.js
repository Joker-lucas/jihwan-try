const { userService } = require('../services'); 
const { successResponse, NotFoundError } = require('../libs/common');

const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    return successResponse(res, users);
  } catch (error) {
    throw error;
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.userId);
    if (!user) {
      throw new NotFoundError('해당 ID의 사용자를 찾을 수 없습니다.');
    }
    return successResponse(res, user);
  } catch (error) {
    throw error;
  }
};

const updateUser = async (req, res) => {
  try {
    const updatedUser = await userService.updateUserById(req.params.userId, req.body);
    if (!updatedUser) {
      throw new NotFoundError('해당 ID의 사용자를 찾을 수 없습니다.');
    }
    return successResponse(res, updatedUser);
  } catch (error) {
    throw error;
  }
};

const deleteUser = async (req, res) => {
  try {
    const isDeleted = await userService.deleteUserById(req.params.userId);
    if (!isDeleted) {
      throw new NotFoundError('해당 ID의 사용자를 찾을 수 없습니다.');
    }
    return successResponse(res, { message: '성공적으로 삭제되었습니다.' });
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