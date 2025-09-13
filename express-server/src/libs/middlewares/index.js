const validation = require('./validation');
require('./passport-cookie');
require('./passport-jwt');
module.exports = {
  ...validation,
};