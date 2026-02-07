import { AsyncLocalStorage } from 'async_hooks';

export const loggerStorage = new AsyncLocalStorage<Map<string, any>>();

export const getContext = <T>(key: string): T | undefined => {
  const store = loggerStorage.getStore();
  return store ? (store.get(key) as T) : undefined;
};

export const setContext = (key: string, value: any): void => {
  const store = loggerStorage.getStore();
  if (store) {
    store.set(key, value);
  }
};
