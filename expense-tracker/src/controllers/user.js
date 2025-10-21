
const { userService } = require('../services');
const { response, error, errorDefinition, authUtils } = require('../libs/common');

const { getLogger } = require('../libs/logger');
const { successResponse } = response;
const { CustomError } = error;
const { ERROR_CODES } = errorDefinition;
const { isAdmin } = authUtils;

const logger = getLogger('controllers/user.js');

const getMyProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    logger.info('내 프로필 조회 요청');

    const user = await userService.getUserById(userId);

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
      exp: user.exp
    };


    successResponse(res, userPayload);
  } catch (error) {
    logger.error(error, '내 프로필 조회 중 에러 발생');
    throw error;
  }
};

const updateMyProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    logger.info({ userId, body: req.body }, '내 프로필 수정 요청');

    const updatedUser = await userService.updateUserById(userId, req.body);

    if (!updatedUser) {
      throw new CustomError(ERROR_CODES.USER_NOT_FOUND);
    }

    const updateUserPayload = {
      nickname: updatedUser.nickname,
      contactEmail: updatedUser.contactEmail,
      profileImageUrl: updatedUser.profileImageUrl,
      gender: updatedUser.gender,
      birthday: updatedUser.birthday,
    };
    successResponse(res, updateUserPayload);
  } catch (error) {
    logger.error(error, '내 프로필 수정 중 에러 발생');
    throw error;
  }
};

const deleteMyAccount = async (req, res, next) => {
  try {

    await userService.deleteUserById(req.user.userId);
    successResponse(res, { message: '계정이 성공적으로 삭제되었습니다.' });
  } catch (error) {
    next(error);
  }
};


const getAllUsers = async (req, res, next) => {
  try {
    if (!isAdmin(req.user)) {
      throw new CustomError(ERROR_CODES.FORBIDDEN);
    }

    const users = await userService.getAllUsers();
    successResponse(res, users);
  } catch (error) {
    throw error;
  }
};

const getUserById = async (req, res, next) => {
  try {

    if (!isAdmin(req.user)) {
      throw new CustomError(ERROR_CODES.FORBIDDEN);
    }

    const user = await userService.getUserById(req.params.userId);
    if (!user) {
      throw new CustomError(ERROR_CODES.USER_NOT_FOUND);
    }

    const userAllPayload = {
      nickname: user.nickname,
      contactEmail: user.contactEmail,
      profileImageUrl: user.profileImageUrl,
      gender: user.gender,
      birthday: user.birthday,
      level: user.level,
      exp: user.exp,
      role: user.role
    };

    successResponse(res, userAllPayload);

  } catch (error) {
    logger.error(error, '내 프로필 조회 중 에러 발생');
    throw error;
  }
};



const updateUserById = async (req, res, next) => {
  try {

    if (!isAdmin(req.user)) {
      throw new CustomError(ERROR_CODES.FORBIDDEN);
    }

    const updatedUser = await userService.updateUserById(req.params.userId, req.body);
    if (!updatedUser) {
      throw new CustomError(ERROR_CODES.USER_NOT_FOUND);      
    }


    const updateUserAllPayload = {
      nickname: updatedUser.nickname,
      contactEmail: updatedUser.contactEmail,
      profileImageUrl: updatedUser.profileImageUrl,
      gender: updatedUser.gender,
      birthday: updatedUser.birthday,
      role: updatedUser.role
    };

    successResponse(res, updateUserAllPayload);


  } catch (error) {
    throw error;
  }
};

const deleteUserById = async (req, res, next) => {
  try {
    if (!isAdmin(req.user)) {
      throw new CustomError(ERROR_CODES.FORBIDDEN);
    }

    const isDeleted = await userService.deleteUserById(req.params.userId);
    if (!isDeleted) {
      throw new CustomError(ERROR_CODES.USER_NOT_FOUND);
    }
    successResponse(res, { message: '성공적으로 삭제되었습니다.' });
  } catch (error) {
    logger.error(error, '내 프로필 수정 중 에러 발생');
    throw error;
  }
};


module.exports = {
  getMyProfile,
  updateMyProfile,
  deleteMyAccount,

  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,

};