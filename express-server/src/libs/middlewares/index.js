const validation = require('./validation');
const verify = require('./verify');
module.exports = {
  ...validation,
  ...verify,
};