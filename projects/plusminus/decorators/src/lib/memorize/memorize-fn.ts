export const memorizeFn = <T extends () => void, R = any>(fn: T, size = 5, duration = 0): (...args: any[]) => R => {
  const cache: Map<string, R> = new Map<string, R>();
  if (duration) {
    setInterval(() => cache.clear(), duration);
  }

  return (...args: any[]): R => {
    const key: string = JSON.stringify(args);
    if (!cache.has(key)) {
      cache.set(key, (fn as any)(...args));
    }

    try {
      return cache.get(key);
    } finally {
      if (cache.size > size) {
        cache.delete(cache.keys().next().value);
      }
    }
  };
};
