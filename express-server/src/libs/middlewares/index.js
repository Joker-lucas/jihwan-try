const validation = require('./validation');
const isAuthenticated = require('./isAuthenticated');
module.exports = {
  ...validation,
  ...isAuthenticated
};