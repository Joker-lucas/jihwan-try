const { reportService } = require('../services');
const { successResponse } = require('../libs/common');

const mapReportToPayload = (report) => ({
  id: report.reportId,
  value: report.value,
  type: report.ReportType.type,
  unit: report.ReportType.unit,
  createdAt: report.createdAt,
});

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

  const reportsPayload = reports.map(mapReportToPayload);

  successResponse(res, { reports: reportsPayload });
};

module.exports = {
  getReports,
};
