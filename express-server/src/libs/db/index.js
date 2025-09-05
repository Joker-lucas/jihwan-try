'use strict';

const db = require('./models');
const connectToDatabase = async () => {
    try {
        await db.sequelize.authenticate();
        console.log('데이터베이스 연결 성공');
    } catch (error) {
        console.error('데이터베이스 연결 실패:', error);
        throw error;
    }
};
module.exports = {
    db,
    connectToDatabase,
};