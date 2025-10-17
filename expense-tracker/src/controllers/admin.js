const { adminService } = require('../services');
const { response, error, errorDefinition } = require('../libs/common');
const { getLogger } = require('../libs/logger');
const { successResponse } = response;
const { CustomError } = error;
const { ERROR_CODES } = errorDefinition;

const logger = getLogger('controllers/admin.js');

const getAllUsers = async (req, res) => {
    try {
        const users = await adminService.getAllUsers();
        successResponse(res, users);
    } catch (error) {
        throw error;
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await adminService.getUserById(req.params.userId);
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
        const updatedUser = await adminService.updateUserById(req.params.userId, req.body);
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
        const isDeleted = await adminService.deleteUserById(req.params.userId);
        if (!isDeleted) {
            throw new CustomError(ERROR_CODES.USER_NOT_FOUND);
        }
        successResponse(res, { message: '성공적으로 삭제되었습니다.' });
    } catch (error) {
        throw error;
    }
};

const getAllChallenges = (req, res, next) => {
    logger.info('전체 도전과제 목록 조회 요청 (Admin)');
    try {
        const mockChallenges = [
            { challengeId: 1, title: '첫 수입 기록하기', rewardXp: 50 },
            { challengeId: 2, title: '첫 지출 기록하기', rewardXp: 50 },
        ];
        successResponse(res, mockChallenges);
    } catch (error) {
        logger.error(error, '전체 도전과제 목록 조회 중 에러 발생 (Admin)');
        next(error);
    }
};

const createChallenge = (req, res, next) => {
    logger.info({ body: req.body }, '새로운 도전과제 생성 요청 (Admin)');
    try {
        const newChallenge = {
            challengeId: 10,
            title: req.body.title,
            description: req.body.description,
            rewardXp: req.body.rewardXp,
        };
        successResponse(res, newChallenge, 201);
    } catch (error) {
        logger.error(error, '도전과제 생성 중 에러 발생 (Admin)');
        next(error);
    }
};

const updateChallenge = (req, res, next) => {
    const { challengeId } = req.params;
    logger.info({ challengeId, body: req.body }, '도전과제 수정 요청 (Admin)');
    try {
        const updatedChallenge = {
            challengeId: parseInt(challengeId),
            title: req.body.title || '수정된 챌린지',
            description: req.body.description || '내용이 수정되었습니다.',
            rewardXp: req.body.rewardXp || 150,
        };
        successResponse(res, updatedChallenge);
    } catch (error) {
        logger.error(error, '도전과제 수정 중 에러 발생 (Admin)');
        next(error);
    }
};

const deleteChallenge = (req, res, next) => {
    const { challengeId } = req.params;
    logger.info({ challengeId }, '도전과제 삭제 요청 (Admin)');
    try {
        successResponse(res, { message: `도전과제(ID: ${challengeId})가 성공적으로 삭제되었습니다.` });
    } catch (error) {
        logger.error(error, '도전과제 삭제 중 에러 발생 (Admin)');
        next(error);
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getAllChallenges,
    createChallenge,
    updateChallenge,
    deleteChallenge,
};