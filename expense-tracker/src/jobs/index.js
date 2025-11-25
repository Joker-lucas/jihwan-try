const CHALLENGE_JOB_FUNCTIONS = require('./challenge-jobs');
const REPORT_JOB_FUNCTIONS = require('./report-jobs');

module.exports = {
  ...CHALLENGE_JOB_FUNCTIONS,
  ...REPORT_JOB_FUNCTIONS,
};
