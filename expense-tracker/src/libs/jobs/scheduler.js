const cron = require('node-cron');
const { FinancialYear } = require('../db/models'); 
const { getLogger } = require('../logger'); 

const logger = getLogger('jobs/scheduler.js');

const initializeFinancialYears = async () => {
    const currentYear = new Date().getFullYear();

    const yearsToGenerate = [currentYear, currentYear + 1];

    logger.info('2년치 기간데이터 생성 시작');

    for (const year of yearsToGenerate) {
        for (let month = 1; month <= 12; month++) {
            await FinancialYear.findOrCreate({
                where: { year, month }
            });
        }
    }
    logger.info('2년치 기간데이터 생성 완료');
};

module.exports = {
    initializeFinancialYears
};