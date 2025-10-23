
const { incomeService } = require('../services');
const { getLogger } = require('../libs/logger');
const { response, authUtils } = require('../libs/common'); 
const { successResponse } = response;
const { isAdmin } = authUtils;

const logger = getLogger('controllers/income.js');

const getIncomes = async (req, res, next) => {
    try {
        const requester = req.user;
        const year = req.query.year;
        const month = req.query.month;

        let targetUserId;

        if (isAdmin(requester)) {
            if (!req.query.userId) {
                throw new CustomError(ERROR_CODES.BAD_REQUEST);
            }
            targetUserId = parseInt(req.query.userId);
        } else {
            if (req.query.userId && parseInt(req.query.userId) !== requester.userId) {
                throw new CustomError(ERROR_CODES.FORBIDDEN);
            }
            targetUserId = requester.userId;
        }

        const page = parseInt(req.query.page || 1);
        const limit = parseInt(req.query.limit || 10);
        const offset = (page - 1) * limit;

        const { totalCount, incomes } = await incomeService.getIncomes(
            targetUserId, 
            year, 
            month, 
            limit, 
            offset
        );

        successResponse(res, {
            totalCount,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page,
            incomes
        });

    } catch (error) {
        throw error;
    }
};

const getIncomeById = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const incomeId = req.params.incomeId;

        const income = await incomeService.getIncomeById(userId, incomeId);

        successResponse(res, income);

    } catch (error) {
        throw error;
    }
};

const createIncome = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const incomeData = req.body;

        const newIncome = await incomeService.createIncome(userId, incomeData);

        successResponse(res, newIncome, 201);

    } catch (error) {
        throw error;
    }
};

const updateIncome = async(req, res, next) => {
    try {
        const userId = req.user.userId;
        const incomeId = req.params.incomeId; 
        const updateData = req.body;

        const updatedIncome = await incomeService.updateIncome(userId, incomeId, updateData);
        successResponse(res, updatedIncome);

    } catch (error) {
        throw error;
    }
};

const deleteIncome = async(req, res, next) => {
    try {
        const userId = req.user.userId;
        const incomeId = req.params.incomeId;

        await incomeService.deleteIncome(userId, incomeId);
        
        successResponse(res, { message: `수입 내역이 성공적으로 삭제되었습니다.` });
    } catch (error) {
        logger.error(error, '수입 내역 삭제 중 에러 발생');
        throw error;

    }
};

module.exports = {
    getIncomes,
    getIncomeById,
    createIncome,
    updateIncome,
    deleteIncome,
};