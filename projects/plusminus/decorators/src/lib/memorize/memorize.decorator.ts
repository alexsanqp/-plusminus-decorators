import { memorizeFn } from './memorize-fn';

export function Memorize(opts: { size?: number; duration?: number } = {}): any {
  return (target: object, name: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
    descriptor.value = memorizeFn(target[name], opts.size, opts.duration);

    return descriptor;
  };
}
