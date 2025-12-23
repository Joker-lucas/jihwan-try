const { db } = require('../libs/db');
const { redisClient } = require('../libs/redis');

const { response } = require('../libs/common');

const { successResponse } = response;

const getHealth = async (req, res) => {
  const healthStatus = {
    server: {
      status: 'OK',
      uptime: process.uptime(),
    },
    database: {
      status: 'UNKNOWN',
    },
    redis: {
      status: 'UNKNOWN',
    },
  };

  let isHealthy = true;

  try {
    await db.sequelize.authenticate();
    healthStatus.database.status = 'OK';
  } catch (error) {
    healthStatus.database.status = 'FAIL';
    isHealthy = false;
  }

  try {
    await redisClient.ping();
    healthStatus.redis.status = 'OK';
  } catch (error) {
    healthStatus.redis.status = 'FAIL';
    isHealthy = false;
  }

  if (isHealthy) {
    return successResponse(res, healthStatus);
  }
  return res.status(503).json({ ...healthStatus });
};
module.exports = {
  getHealth,
};
