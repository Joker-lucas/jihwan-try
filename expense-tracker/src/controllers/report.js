const { reportService } = require('../services');
const { successResponse } = require('../libs/common');

const getReports = async (req, res) => {
  const { userId } = req.user;
  const { reportType, sortBy, sortOrder } = req.query;

  const options = {
    userId,
    reportType,
    sortBy,
    sortOrder: sortOrder || 'DESC',
  };

  const reports = await reportService.getReports(options);

  successResponse(res, { reports });
};

module.exports = {
  getReports,
};
