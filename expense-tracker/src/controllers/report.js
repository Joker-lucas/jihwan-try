const { getLogger } = require('../libs/logger');
const { response } = require('../libs/common');
const { successResponse } = response;

const logger = getLogger('controllers/report.js');

const getMonthlyReport = (req, res, next) => {
    logger.info('월별 분석 보고서 조회 요청 시작');
    try {
        const testReport = {
            summary: {
                totalIncome: 3500000,
                totalExpense: 1250000,
                incomeChangePercentage: 5.5,  
                expenseChangePercentage: -2.1,
            },
            expenseReport: {
                byCategory: [
                    { category: 'LIVING_EXPENSES', totalAmount: 750000 },
                    { category: 'LEISURE', totalAmount: 300000 },
                    { category: 'FIXED_EXPENSES', totalAmount: 200000 },
                ],
                byPaymentMethod: [
                    { paymentMethod: 'CREDIT_CARD', totalAmount: 900000 },
                    { paymentMethod: 'DEBIT_CARD', totalAmount: 350000 },
                ],
                topExpenses: [
                    {
                        expenseId: 105,
                        userId: 14,
                        date: '2025-10-20',
                        amount: 150000,
                        category: 'LEISURE',
                        description: '콘서트 티켓 예매',
                    }
                ],
            },
            incomeReport: {
                byCategory: [
                    { category: 'SALARY', totalAmount: 3000000 },
                    { category: 'SIDE_INCOME', totalAmount: 500000 },
                ],
                topIncomes: [
                    {
                        incomeId: 5,
                        userId: 14,
                        date: '2025-10-10',
                        amount: 3000000,
                        category: 'SALARY',
                        description: '10월 급여',
                    }
                ],
            },
        };

        logger.info('월별 분석 보고서 조회 성공');
        successResponse(res, testReport);
    } catch (error) {
        logger.error(error, '월별 분석 보고서 조회 중 에러 발생');
        next(error);
    }
};

module.exports = {
    getMonthlyReport,
};