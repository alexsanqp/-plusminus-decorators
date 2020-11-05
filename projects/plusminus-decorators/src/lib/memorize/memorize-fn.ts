import { MemorizeOptions } from './memorize-options.interface';

const DEFAULT_OPTS: MemorizeOptions = {
  size: 20,
  duration: 0,
};

/**
 * Higher-order function that memoizes functions.
 *
 * @see `{@link MemorizeOptions}`
 */
export const memorizeFn = <T extends (...args: any[]) => any, R = any>(
  fn: T, opts: MemorizeOptions = DEFAULT_OPTS): (...args: any[]) => R => {
  const cache: Map<string, R> = new Map<string, R>();
  if (opts.duration) {
    setInterval(() => cache.clear(), opts.duration);
  }

  return (...args: any[]): R => {
    const key: string = JSON.stringify(args);
    if (!cache.has(key)) {
      cache.set(key, (fn as any)(...args));
    }

    try {
      return cache.get(key);
    } finally {
      if (cache.size > opts.size) {
        cache.delete(cache.keys().next().value);
      }
    }
  };
};
