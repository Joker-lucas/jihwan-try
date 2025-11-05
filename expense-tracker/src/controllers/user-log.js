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

  const { userId, traceId } = req.query;
  const page = parseInt(req.query.page || 1, 10);
  const limit = parseInt(req.query.limit || 10, 10);

  const logs = await userLogService.getLogs({
    limit,
    page,
    userId: userId ? parseInt(userId, 10) : undefined,
    traceId,
  });

  successResponse(res, logs);
};

module.exports = {
  getLogs,
};
