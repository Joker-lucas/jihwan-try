const { userLogService } = require('../services');
const {
  authUtils, response, CustomError, ERROR_CODES,
} = require('../libs/common');

const { isAdmin } = authUtils;
const { successResponse } = response;

const getLogs = async (req, res) => {
  if (!isAdmin(req.user)) {
    throw new CustomError(ERROR_CODES.FORBIDDEN);
  }

  const { userId } = req.query;
  const page = parseInt(req.query.page || 1, 10);
  const limit = parseInt(req.query.limit || 10, 10);
  const offset = (page - 1) * limit;

  const logs = await userLogService.getLogs({
    limit,
    offset,
    userId: userId ? parseInt(userId, 10) : undefined,
  });

  successResponse(res, logs);
};

module.exports = {
  getLogs,
};
