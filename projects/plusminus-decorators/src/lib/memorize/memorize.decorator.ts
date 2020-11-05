import { memorizeFn } from './memorize-fn';
import { MemorizeOptions } from './memorize-options.interface';

/**
 * A decorator that memoizes class methods.
 *
 * @see `{@link MemorizeOptions}`
 *
 * @Annotation
 */
export function Memorize(opts?: MemorizeOptions): any {
  return (target: object, name: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
    descriptor.value = memorizeFn(target[name], opts);

    return descriptor;
  };
}
