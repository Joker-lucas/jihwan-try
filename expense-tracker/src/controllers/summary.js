const { getLogger } = require('../libs/logger');
const { response } = require('../libs/common');
const { successResponse } = response;

const logger = getLogger('controllers/summary.js');

const getMonthlySummary = (req, res, next) => {
    logger.info(`월별 요약 조회 요청 시작`);

    try {
        const testSummary = {
            totalIncome: 3066000,
            totalExpense: 2102400,
            totalresult: 963600, 
        };

        logger.info('월별 요약 조회 성공');
        successResponse(res, testSummary);
    } catch (error) {
        logger.error(error, '월별 요약 조회 중 에러 발생');
        next(error);
    }
};

module.exports = {
    getMonthlySummary,
};