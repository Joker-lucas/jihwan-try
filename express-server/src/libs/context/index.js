const { AsyncLocalStorage } = require('async_hooks');

const asyncLocalStorage = new AsyncLocalStorage();

const getContext = (key) => {
  const store = asyncLocalStorage.getStore();
  return store ? store.get(key) : undefined;
};

const setContext = (key, value) => {
  const store = asyncLocalStorage.getStore();
  if (store) {
    store.set(key, value);
  }
};

module.exports = {
  asyncLocalStorage,
  getContext,
  setContext,
};