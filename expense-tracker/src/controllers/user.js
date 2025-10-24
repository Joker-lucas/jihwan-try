
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

    const search = req.query.search;
    const searchBy = req.query.searchBy;

    const users = await userService.getAllUsers(search, searchBy);

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

    if (!isSelfOrAdmin(requester, targetUserId)) {
      throw new CustomError(ERROR_CODES.FORBIDDEN);
    }

    const user = await userService.getUserById(targetUserId);

    if (!user) {
      throw new CustomError(ERROR_CODES.USER_NOT_FOUND);
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
    throw error;
  }
};



const updateUserById = async (req, res, next) => {
  try {

    const requester = req.user;
    const targetUserId = req.params.userId;
    const updateData = req.body;

    if (!isSelfOrAdmin(requester, targetUserId)) {
      throw new CustomError(ERROR_CODES.FORBIDDEN);
    }

    const user = await userService.getUserById(targetUserId);

    if (!user) {
        throw new CustomError(ERROR_CODES.USER_NOT_FOUND);
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

    if (!isSelfOrAdmin(requester, targetUserId)) {
      throw new CustomError(ERROR_CODES.FORBIDDEN);
    }

    const userExists = await userService.getUserById(targetUserId);
    if (!userExists) {
        throw new CustomError(ERROR_CODES.USER_NOT_FOUND);
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