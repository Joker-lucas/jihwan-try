
const { userService } = require('../services');
const { response, error, errorDefinition, authUtils } = require('../libs/common');

const { getLogger } = require('../libs/logger');
const { successResponse } = response;
const { CustomError } = error;
const { ERROR_CODES } = errorDefinition;
const { isAdmin, isSelfOrAdmin } = authUtils;

const logger = getLogger('controllers/user.js');


const getAllUsers = async (req, res, next) => {
  try {
    if (!isAdmin(req.user)) {
      throw new CustomError(ERROR_CODES.FORBIDDEN);
    }

    const users = await userService.getAllUsers();

    const usersPayload = users.map(user => ({
      nickname: user.nickname, 
      contactEmail: user.contactEmail,
      profileImageUrl: user.profileImageUrl,
      gender: user.gender,
      birthday: user.birthday,
      level: user.level,
      exp: user.exp,
      role: user.role
    }));

    successResponse(res, usersPayload);
  } catch (error) {
    throw error;
  }
};

const getUserById = async (req, res, next) => {
  try {

    const requester = req.user;
    const targetUserId = req.params.userId; 

    const user = await userService.getUserById(targetUserId);

    if (!user) {
      throw new CustomError(ERROR_CODES.USER_NOT_FOUND);
    }

    if (!isSelfOrAdmin(requester, targetUserId)) {
      throw new CustomError(ERROR_CODES.FORBIDDEN);
    }

    const userPayload = {
      nickname: user.nickname,
      contactEmail: user.contactEmail,
      profileImageUrl: user.profileImageUrl,
      gender: user.gender,
      birthday: user.birthday,
      level: user.level,
      exp: user.exp,
      role: user.role
    };

    successResponse(res, userPayload);

  } catch (error) {
    logger.error(error, '내 프로필 조회 중 에러 발생');
    throw error;
  }
};



const updateUserById = async (req, res, next) => {
  try {

    const requester = req.user;
    const targetUserId = req.params.userId;
    const updateData = req.body;

    const user = await userService.getUserById(targetUserId);

    if (!user) {
        throw new CustomError(ERROR_CODES.USER_NOT_FOUND);
    }

    if (!isSelfOrAdmin(requester, targetUserId)) {
      throw new CustomError(ERROR_CODES.FORBIDDEN);
    }

    if (updateData.role && !isAdmin(requester)) {
      throw new CustomError(ERROR_CODES.FORBIDDEN);
    }

    await userService.updateUserById(targetUserId, updateData);

    const updateUserAllPayload = {
      nickname: user.nickname,
      contactEmail: user.contactEmail,
      profileImageUrl: user.profileImageUrl,
      gender: user.gender,
      birthday: user.birthday,
      role: user.role
    };

    successResponse(res, updateUserAllPayload);


  } catch (error) {
    throw error;
  }
};

const deleteUserById = async (req, res, next) => {
  try {

    const requester = req.user;
    const targetUserId = req.params.userId;

    const userExists = await userService.getUserById(targetUserId);
    if (!userExists) {
        throw new CustomError(ERROR_CODES.USER_NOT_FOUND);
    }

    if (!isSelfOrAdmin(requester, targetUserId)) {
      throw new CustomError(ERROR_CODES.FORBIDDEN);
    }

    await userService.deleteUserById(targetUserId);

    successResponse(res, { message: '성공적으로 삭제되었습니다.' });
  } catch (error) {
    throw error;
  }
};


module.exports = {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,

};