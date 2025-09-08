export interface Deferred<T> {
  promise: Promise<T>;
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: unknown) => void;
  isResolved: boolean;
}

export function createDeferred<T>(): Deferred<T> {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: unknown) => void;
  let isResolved = false;

  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return {
    promise,
    resolve(value: T | PromiseLike<T>) {
      isResolved = true;
      return resolve(value);
    },
    reject(reason?: unknown) {
      isResolved = true;
      return reject(reason);
    },
    get isResolved() {
      return isResolved;
    },
  };
}
