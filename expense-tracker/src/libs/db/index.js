const db = require('./models');
const { getLogger } = require('../logger');

const logger = getLogger('libs/db/index.js');
const connectToDatabase = async () => {
  try {
    await db.sequelize.authenticate();
    logger.info('데이터베이스 연결 성공');
  } catch (error) {
    logger.error({ err: error }, '데이터베이스 연결 실패');
    throw error;
  }
};
module.exports = {
  db,
  connectToDatabase,
};
