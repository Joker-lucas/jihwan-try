const validation = require('./validation');
const isAuthenticated = require('./is-authenticated');
const { cache } = require('./cache');

module.exports = {
  ...validation,
  ...isAuthenticated,
  cache,
};
