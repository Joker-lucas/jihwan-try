const { getLogger } = require('../libs/logger');

const { response, error, errorDefinition, authUtils } = require('../libs/common');
const { successResponse } = response;
const { isSelfOrAdmin } = authUtils;
const { CustomError } = error;
const { ERROR_CODES } = errorDefinition;


const logger = getLogger('controllers/challenge.js');

const getAllChallenges = (req, res, next) => {
    logger.info('전체 도전과제 목록 조회 요청 시작');
    try {
        const mockChallenges = [
            {
                challengeId: 1,
                title: '첫 수입 기록하기',
                description: '처음으로 수입 내역을 작성해보세요.',
                rewardXp: 50,
            },
            {
                challengeId: 2,
                title: '첫 지출 기록하기',
                description: '처음으로 지출 내역을 작성해보세요.',
                rewardXp: 50,
            },
            {
                challengeId: 3,
                title: '월 예산 100% 달성',
                description: '설정한 월별 목표 지출을 초과하지 않고 한 달을 마무리하세요.',
                rewardXp: 200,
            },
        ];

        logger.info('전체 도전과제 목록 조회 성공');
        successResponse(res, mockChallenges);
    } catch (error) {
        logger.error(error, '전체 도전과제 목록 조회 중 에러 발생');
        throw (error);
    }
};

const getChallengeStatus = (req, res, next) => {
    try {
        const requester = req.user;
        const { userId: resourceUserId } = req.params;

        if (!isSelfOrAdmin(requester, resourceUserId)) {
            throw new CustomError(ERROR_CODES.FORBIDDEN);
        }

        const testMyStatus = [
            {
                challengeId: 1,
                title: '첫 수입 기록하기',
                status: 'COMPLETED',
                description: '처음으로 수입 내역을 작성해보세요.',
                rewardXp: 50,
                status: 'COMPLETED', 
                achievedAt: '2025-10-17',
            },
            {
                challengeId: 2,
                title: '첫 지출 기록하기',
                description: '처음으로 지출 내역을 작성해보세요.',
                rewardXp: 50,
                status: 'PENDING', 
                achievedAt: null,
            },
            {
                challengeId: 3,
                title: '월 예산 100% 달성',
                description: '설정한 월별 목표 지출을 초과하지 않고 한 달을 마무리하세요.',
                rewardXp: 200,
                status: 'PENDING',
                achievedAt: null,
            },
        ];
        logger.info({ userId: resourceUserId }, '유저 챌린지 현황 조회 성공');
        successResponse(res, testMyStatus);
    } catch (error) {
        logger.error(error, '유저 챌린지 현황 조회 중 에러 발생');
        throw error;
    }
};

const createChallenge = (req, res, next) => {
    try {

        if (!isAdmin(req.user)) {
            throw new CustomError(ERROR_CODES.FORBIDDEN);
        }
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
    try {
        if (!isAdmin(req.user)) {
            throw new CustomError(ERROR_CODES.FORBIDDEN);
        }
        const { challengeId } = req.params;

        const updatedChallenge = {
            challengeId: parseInt(challengeId),
            title: req.body.title || '수정된 챌린지',
            description: req.body.description || '내용이 수정되었습니다.',
            rewardXp: req.body.rewardXp || 150,
        };
        successResponse(res, updatedChallenge);
    } catch (error) {
        throw (error);
    }
};

const deleteChallenge = (req, res, next) => {
    try {
        if (!isAdmin(req.user)) {
            throw new CustomError(ERROR_CODES.FORBIDDEN);
        }

        successResponse(res, { message: `도전과제가 성공적으로 삭제되었습니다.` });
    } catch (error) {
        throw (error);
    }
};


module.exports = {
    getAllChallenges,
    getChallengeStatus,
    createChallenge,
    updateChallenge,
    deleteChallenge,
};