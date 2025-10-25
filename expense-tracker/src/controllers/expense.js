const { expenseService } = require('../services');
const { getLogger } = require('../libs/logger');
const { response, authUtils, error, errorDefinition } = require('../libs/common');
const { successResponse } = response;
const { isAdmin } = authUtils;
const { CustomError } = error;
const { ERROR_CODES } = errorDefinition;

const logger = getLogger('controllers/expense.js');

const getExpenses = async (req, res, next) => { 
    try {
        const requester = req.user;
        const year = req.query.year;
        const month = req.query.month;

        let targetUserId;

        if (!req.query.userId) {
            throw new CustomError(ERROR_CODES.BAD_REQUEST);
        }

        if (!isAdmin(requester)) {
            if (parseInt(req.query.userId) !== requester.userId) {
                throw new CustomError(ERROR_CODES.FORBIDDEN);
            }
        }

        targetUserId = parseInt(req.query.userId);

        const page = parseInt(req.query.page || 1);
        const limit = parseInt(req.query.limit || 10);
        const offset = (page - 1) * limit;

        const { totalCount, expenses } = await expenseService.getExpenses(
            targetUserId,
            year,
            month,
            limit,
            offset
        );

        successResponse(res, {
            totalCount,
            expenses 
        });

    } catch (error) {
        throw error;
    }
};


const getExpenseById = async (req, res, next) => { 
    try {
        const userId = req.user.userId;
        const expenseId = req.params.expenseId; 
        const expense = await expenseService.getExpenseById(userId, expenseId);

        successResponse(res, expense); 

    } catch (error) {
        throw error;
    }
};
const createExpense = async (req, res, next) => { 
    try {
        const userId = req.user.userId;
        const expenseData = req.body; 

        const newExpense = await expenseService.createExpense(userId, expenseData);

        successResponse(res, newExpense, 201); 

    } catch (error) {
        throw error;
    }
};

const updateExpense = async (req, res, next) => { 
    try {
        const userId = req.user.userId;
        const expenseId = req.params.expenseId; 
        const updateData = req.body;

        const updatedExpense = await expenseService.updateExpense(userId, expenseId, updateData);
        
        successResponse(res, updatedExpense);

    } catch (error) {
        throw error;
    }
};

const deleteExpense = async (req, res, next) => { 
    try {
        const userId = req.user.userId;
        const expenseId = req.params.expenseId; 

        await expenseService.deleteExpense(userId, expenseId);

        successResponse(res, { message: `지출 내역이 성공적으로 삭제되었습니다.` });
    } catch (error) {
        logger.error(error, '지출 내역 삭제 중 에러 발생');
        throw error;
    }
};

module.exports = {
    getExpenses,
    getExpenseById,
    createExpense,
    updateExpense,
    deleteExpense,
};