const { getLogger } = require('../libs/logger');
const { response } = require('../libs/common');
const { successResponse } = response;

const logger = getLogger('controllers/expense.js');

const getAllExpenses = (req, res, next) => {
    logger.info('지출 내역 조회 요청 시작');
    try {
        const testExpenses = [
            {
                expenseId: 101,
                userId: 14, 
                financialYearId: 1,
                date: '2025-10-16',
                amount: 15000,
                category: 'LIVING_EXPENSES',
                paymentMethod: 'CREDIT_CARD',
                status: 'APPROVED',
                description: '점심 식사',
            },
            {
                expenseId: 102,
                userId: 14,
                financialYearId: 1,
                date: '2025-10-17',
                amount: 80000,
                category: 'LEISURE',
                paymentMethod: 'DEBIT_CARD',
                status: 'APPROVED',
                description: '영화 관람 및 팝콘',
            },
        ];

        logger.info('모든 지출 내역 조회 성공');
        successResponse(res, testExpenses);
    } catch (error) {
        logger.error(error, '지출 내역 조회 중 에러 발생');
        next(error);
    }
};


const createExpense = (req, res, next) => {
    logger.info('지출 내역 생성 요청 시작');
    try {
        const date = req.body.date;
        const amount = req.body.amount;
        const category = req.body.category;
        const paymentMethod = req.body.paymentMethod;
        const status = req.body.status;
        const description = req.body.description;

        const createdExpense = {
            expenseId: 199, 
            userId: 14,
            financialYearId: 1,
            date: date,
            amount: amount,
            category: category,
            paymentMethod: paymentMethod,
            status: status,
            description: description,
        };

        logger.info({ newExpenseId: createdExpense.expenseId }, '새로운 지출 내역 생성 성공');
        successResponse(res, createdExpense, 201);
    } catch (error) {
        logger.error(error, '지출 내역 생성 중 에러 발생');
        next(error);
    }
};

const updateExpense = (req, res, next) => {
    logger.info('지출 내역 수정 요청 시작');
    try {
        const date = req.body.date;
        const amount = req.body.amount;
        const category = req.body.category;
        const paymentMethod = req.body.paymentMethod;
        const status = req.body.status;
        const description = req.body.description;

        const updatedExpense = {
            expenseId: parseInt(expenseId),
            userId: 14,
            financialYearId: 1,
            date: date || '2025-10-16',
            amount: amount || 17000,
            category: category || 'LIVING_EXPENSES',
            paymentMethod: paymentMethod || 'CASH',
            status: status || 'APPROVED',
            description: description || '점심 식사 (수정됨)',
        };

        logger.info({ updatedExpenseId: updatedExpense.expenseId }, '지출 내역 수정 성공');
        successResponse(res, updatedExpense);
    } catch (error) {
        logger.error(error, '지출 내역 수정 중 에러 발생');
        next(error);
    }
};

const deleteExpense = (req, res, next) => {
    logger.info('지출 내역 삭제 요청 시작');
    try {
        logger.info({ deletedExpenseId: expenseId }, '지출 내역 삭제 성공');   
        successResponse(res, { message: `지출 내역이 성공적으로 삭제되었습니다.` });
    } catch (error) {
        logger.error(error, '지출 내역 삭제 중 에러 발생');
        next(error);
    }
};

module.exports = {
    getAllExpenses,
    createExpense,
    updateExpense,
    deleteExpense,
};