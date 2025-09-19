const { AsyncLocalStorage } = require('async_hooks');
const { randomUUID } = require('crypto');

const asyncLocalStorage = new AsyncLocalStorage();
const entireStore = new Map();

const waitFinish = (res) => {
  return new Promise((resolve) => {
    res.on('finish', resolve);
  });
};

const context = async (req, res, next) => {  
  const traceId = randomUUID(); 
  const requestContext = new Map();
  requestContext.set('traceId', traceId);
  entireStore.set(traceId, requestContext);


  try{
    await asyncLocalStorage.run(requestContext, async ()=> {
      next();

      await waitFinish(res);
    });
  } catch (error){
    logger.error(error, `오류 발생`);
    return res.status(500).json({ message: '서버에 문제가 발생했습니다.' });
  }
  
  finally{
    entireStore.delete(traceId);
  }
};

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
  context,
  getContext,
  setContext,
};