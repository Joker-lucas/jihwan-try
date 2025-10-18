const { getLogger } = require('../libs/logger');
const { response } = require('../libs/common');
const { successResponse } = response;

const logger = getLogger('controllers/targetSpending.js');

const getAllTargetSpendings = (req, res, next) => {
    logger.info(`월별 목표 지출 조회 요청 시작`);

    try {
        const testTargetSpendings = [
            {
                targetSpendingId: 1,
                userId: 14,
                financialYearId: 1,
                category: 'LIVING_EXPENSES',
                amount: 500000,
                description: '10월 생활비 목표',
            },
            {
                targetSpendingId: 2,
                userId: 14,
                financialYearId: 1,
                category: 'LEISURE',
                amount: 200000,
                description: '10월 여가비 목표',
            },
        ];

        logger.info('월별 목표 지출 조회 성공');
        successResponse(res, testTargetSpendings);
    } catch (error) {
        logger.error(error, '월별 목표 지출 조회 중 에러 발생');
        next(error);
    }
};

const createTargetSpending = (req, res, next) => {
    logger.info('새로운 월별 목표 지출 생성 요청 시작');
    try {
        const year = req.body.year;
        const month = req.body.month;
        const category = req.body.category;
        const amount = req.body.amount;
        const description = req.body.description;

        const createdTargetSpending = {
            targetSpendingId: 3, 
            userId: 14,
            financialYearId: 1,
            category: category,
            amount: amount,
            description: description,
        };

        logger.info({ newId: createdTargetSpending.targetSpendingId }, '새로운 월별 목표 지출 생성 성공');
        successResponse(res, createdTargetSpending, 201);
    } catch (error) {
        logger.error(error, '월별 목표 지출 생성 중 에러 발생');
        next(error);
    }
};

const updateTargetSpending = (req, res, next) => {
    logger.info( '월별 목표 지출 수정 요청 시작');

    try {
        const category = req.body.category;
        const amount = req.body.amount;
        const description = req.body.description;

        const updatedTargetSpending = {
            targetSpendingId: parseInt(targetSpendingId),
            userId: 14,
            financialYearId: 1,
            category: category || 'LIVING_EXPENSES',
            amount: amount || 550000,
            description: description || '10월 생활비 목표 (수정됨)',
        };

        logger.info({ updatedId: updatedTargetSpending.targetSpendingId }, '월별 목표 지출 수정 성공');
        successResponse(res, updatedTargetSpending);
    } catch (error) {
        logger.error(error, '월별 목표 지출 수정 중 에러 발생');
        next(error);
    }
};

const deleteTargetSpending = (req, res, next) => {
    logger.info( '월별 목표 지출 삭제 요청 시작');
    try {
        logger.info({ deletedId: targetSpendingId }, '월별 목표 지출 삭제 성공');
        successResponse(res, { message: `월별 목표 지출이 성공적으로 삭제되었습니다.` });
    } catch (error) {
        logger.error(error, '월별 목표 지출 삭제 중 에러 발생');
        next(error);
    }
};

module.exports = {
    getAllTargetSpendings,
    createTargetSpending,
    updateTargetSpending,
    deleteTargetSpending,
};