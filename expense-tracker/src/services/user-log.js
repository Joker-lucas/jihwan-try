const { UserLog, User } = require('../libs/db/models');
const { userLogDefinition } = require('../libs/common');
const { getContext } = require('../libs/context');

const { LOG_INFO } = userLogDefinition;

const createLog = async (logData) => {
  const {
    userId, actionType, details, status,
  } = logData;
  const traceId = getContext('traceId');


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
    traceId,
  });

  return newLog;
};

const getLogs = async (options = {}) => {
  const {
    limit = 10, page = 1, userId, traceId,
  } = options;

  const offset = (page - 1) * limit;

  const where = {};
  if (userId) {
    where.userId = userId;
  }
  if (traceId) {
    where.traceId = traceId;
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
