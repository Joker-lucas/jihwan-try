const { UserLog, User } = require('../libs/db/models');
const { userLogDefinition } = require('../libs/common');

const { LOG_INFO } = userLogDefinition;

const createLog = async (logData) => {
  const {
    userId, actionType, details, status,
  } = logData;

  const logInfo = LOG_INFO[actionType];
  const statusInfo = logInfo[status];
  const message = statusInfo(details);

  const newLog = await UserLog.create({
    userId,
    actionType,
    status,
    details: {
      message,
    },
  });

  return newLog;
};

const getLogs = async (options = {}) => {
  const { limit = 10, offset = 0, userId } = options;

  const where = {};
  if (userId) {
    where.userId = userId;
  }

  const logs = await UserLog.findAndCountAll({
    where,
    include: [{
      model: User,
      attributes: ['nickname', 'email', 'role'],
    }],
    order: [['createdAt', 'DESC']],
    limit,
    offset,
  });

  return logs;
};

module.exports = {
  createLog,
  getLogs,
};
