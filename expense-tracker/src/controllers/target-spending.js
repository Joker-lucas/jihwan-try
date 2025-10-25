const { targetSpendingService } = require('../services');
const { getLogger } = require('../libs/logger');
const { response, authUtils, error, errorDefinition } = require('../libs/common');
const { successResponse } = response;
const { isAdmin } = authUtils;
const { CustomError } = error;
const { ERROR_CODES } = errorDefinition;

const logger = getLogger('controllers/targetSpending.js');

const getTargetSpendings = async (req, res, next) => {
    try {
        const requester = req.user;
        const year = req.query.year;
        const month = req.query.month;

        if (!year || !month) {
            throw new CustomError(ERROR_CODES.BAD_REQUEST);
        }
    
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

        const { totalCount, targetSpendings } = await targetSpendingService.getTargetSpendings(
            targetUserId,
            year,
            month,
            limit,
            offset
        );

        successResponse(res, {
            totalCount,
            targetSpendings 
        });

    } catch (error) {
        throw error;
    }
};

const getTargetSpendingById = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { targetSpendingId } = req.params;

        const target = await targetSpendingService.getTargetSpendingById(userId, targetSpendingId);
        
        successResponse(res, target);
    } catch (error) {
        throw error;
    }
};

const createTargetSpending = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const targetData = req.body; 

        const createdTarget = await targetSpendingService.createTargetSpending(userId, targetData);

        successResponse(res, createdTarget);
    } catch (error) {
        throw error;
    }
};

const updateTargetSpending = async (req, res, next) => {
    try {
        const targetSpendingId = req.params.targetSpendingId;
        const userId = req.user.userId;
        const updateData = req.body;

        const updatedTarget = await targetSpendingService.updateTargetSpending(userId, targetSpendingId, updateData);

        successResponse(res, updatedTarget);
    } catch (error) {
        throw error;
    }
};

const deleteTargetSpending = async (req, res, next) => {
    try {
        const targetSpendingId = req.params.targetSpendingId;
        const userId = req.user.userId;

        await targetSpendingService.deleteTargetSpending(userId, targetSpendingId);

        successResponse(res, { message: `월별 목표 지출이 성공적으로 삭제되었습니다.` });
    } catch (error) {
        logger.error(error, '월별 목표 지출 삭제 중 에러 발생');
        throw error;
    }
};

module.exports = {
    getTargetSpendings,
    getTargetSpendingById,
    createTargetSpending,
    updateTargetSpending,
    deleteTargetSpending,
};