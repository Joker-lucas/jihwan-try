const validation = require('./validation');
const isAuthenticated = require('./is-authenticated');
module.exports = {
  ...validation,
  ...isAuthenticated
};