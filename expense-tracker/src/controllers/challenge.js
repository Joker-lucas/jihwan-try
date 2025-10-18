const { getLogger } = require('../libs/logger');
const { response } = require('../libs/common');
const { successResponse } = response;

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
        next(error);
    }
};

const getMyChallengeStatus = (req, res, next) => {
    const userId = req.user.userId;
    logger.info({ userId }, '내 도전과제 현황 조회 요청 시작');
    try {
        const testMyStatus = [
            {
                challengeId: 1,
                title: '첫 수입 기록하기',
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

        logger.info({ userId }, '내 도전과제 현황 조회 성공');
        successResponse(res, testMyStatus);
    } catch (error) {
        logger.error(error, '내 도전과제 현황 조회 중 에러 발생');
        next(error);
    }
};

module.exports = {
    getAllChallenges,
    getMyChallengeStatus,
};