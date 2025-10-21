const { getLogger } = require('../libs/logger');
const { response } = require('../libs/common'); 
const { successResponse } = response;

const logger = getLogger('controllers/income.js');

const getAllIncomes = (req, res, next) => {
    try {
        logger.info('수입 내역 조회 요청 시작');
        const testIncomes = [
            {
                incomeId: 1,
                userId: 14,
                financialYearId: 1,
                date: '2025-10-10',
                amount: 3000000,
                category: 'SALARY',
                status: 'APPROVED',
                description: '10월 급여',
            },
            {
                incomeId: 2,
                userId: 14,
                financialYearId: 1,
                date: '2025-10-15',
                amount: 150000,
                category: 'SIDE_INCOME',
                status: 'APPROVED',
                description: '중고 거래 판매 대금',
            },
        ];

        logger.info('모든 수입 내역 조회 성공');
        successResponse(res, testIncomes);
    } catch (error) {
        logger.error(error, '수입 내역 조회 중 에러 발생');
        next(error);
    }
};

const createIncome = (req, res, next) => {
    logger.info('수입 내역 생성 요청 시작');
    try {
        const date = req.body.date;
        const amount = req.body.amount;
        const category = req.body.category;
        const status = req.body.status;
        const description = req.body.description;

        const createdIncome = {
            incomeId: 99, 
            userId: 14,
            financialYearId: 1,
            date: date,
            amount: amount,
            category: category,
            status: status,
            description: description,
        };

        logger.info({ newIncomeId: createdIncome.incomeId }, '새로운 수입 내역 생성 성공');
        successResponse(res, createdIncome, 201);
    } catch (error) {
        logger.error(error, '수입 내역 생성 중 에러 발생');
        next(error);
    }
};

const updateIncome = (req, res, next) => {
    logger.info('수입 내역 수정 요청 시작');
    try {
        const date = req.body.date;
        const amount = req.body.amount;
        const category = req.body.category;
        const status = req.body.status;
        const description = req.body.description;

        const updatedIncome = {
            incomeId: parseInt(incomeId),
            userId: 14,
            financialYearId: 1,
            date: date || '2025-10-10',
            amount: amount || 3100000,
            category: category || 'SALARY',
            status: status || 'APPROVED',
            description: description || '10월 급여 (수정됨)',
        };

        logger.info({ updatedIncomeId: updatedIncome.incomeId }, '수입 내역 수정 성공');
        successResponse(res, updatedIncome);
    } catch (error) {
        logger.error(error, '수입 내역 수정 중 에러 발생');
        next(error);
    }
};

const deleteIncome = (req, res, next) => {
    logger.info('수입 내역 삭제 요청 시작');
    try {
        logger.info({ deletedIncomeId: incomeId }, '수입 내역 삭제 성공');
        successResponse(res, { message: `수입 내역이 성공적으로 삭제되었습니다.` });
    } catch (error) {
        logger.error(error, '수입 내역 삭제 중 에러 발생');
        next(error);
    }
};

module.exports = {
    getAllIncomes,
    createIncome,
    updateIncome,
    deleteIncome,
};