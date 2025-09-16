const { AsyncLocalStorage } = require('async_hooks');
const { randomUUID } = require('crypto');

const asyncLocalStorage = new AsyncLocalStorage();

const context = (req, res, next) => {
  const store = new Map();
  const traceId = randomUUID(); 
  store.set('traceId', traceId);

  asyncLocalStorage.run(store, () => {
    next();
  });
};

module.exports = {
  asyncLocalStorage,
  context,
};