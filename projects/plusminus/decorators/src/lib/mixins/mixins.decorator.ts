import { MixinConstructor } from './mixin-constructor.type';

/**
 * Decorator that helps you implement incomplete multiple inheritance.
 *
 * Mixin classes do not support CIs because they are executed earlier. Used to refine the behavior
 * of other classes, not intended to spawn self-used objects. Mixins are useful for bringing common
 * functionality into a single place and being reusable.
 *
 * @usageNotes
 *
 * The parent class needs to implement the mixin classes (only the declaration of properties or methods)
 * so that the project can be built without errors at the compilation stage.
 *
 * If the mixin class has private fields or methods that you do not want
 * to declare in the parent class, then you can create your own type/interface and declare it:
 *
 * If you want to pass parameters to the constructor of the mixin class,
 * you need to pass an array where the first element will be the mixin class itself,
 * and all subsequent elements are its parameters.
 *
 * @example
 * ```ts
 * class SubscriptionMixin {
 *    // ...
 * }
 *
 * class GoodbyeMixin {
 *    // ...
 * }
 *
 * class GreeterMixin {
 *    public get fullName(): string {
 *      return `${this.firstName} ${this.surName}`;
 *    }
 *
 *    public constructor(private firstName: string, private surName: string) {
 *    }
 *
 *    public greet(): string {
 *      return `Hello, ${this.firstName} ${this.surName}!`;
 *    }
 * }
 *
 * type GreeterMixinType = Omit<GreeterMixin, 'firstName' | 'surName'>;
 * // or
 * interface GreeterInterface extends Omit<GreeterMixin, 'firstName' | 'surName'> {}
 *
 * @Component({...})
 * @Mixins([
 *    SubscriptionMixin,
 *    GoodbyeMixin,
 *    [GreeterMixin, 'John', 'Wick'],
 * ])
 * class HelloWorld implements GreeterMixinType {
 *    public fullName: string;
 *    public greet: () => string;
 *    // Other declarations: SubscriptionMixin, GoodbyeMixin
 *
 *    public constructor() {
 *      alert(this.greet());
 *    }
 * }
 * ```
 *
 * @Annotation
 */
export const Mixins = <T extends MixinConstructor<{}>>(bases: (T | [T, ...any[]])[]) => {
  return (target) => {
    for (const base of bases) {
      try {
        let constructor;
        let instance;

        if (Array.isArray(base)) {
          const [mixinCtor, ...params] = base;
          constructor = mixinCtor;
          instance = new constructor(...params);
        } else {
          constructor = base;
          instance = new base();
        }

        mappingPropertyFromInstance(target, instance);
        mappingProperty(target, constructor);
      } catch (e) {
        console.warn(e);
      }
    }
  };
};

function mappingPropertyFromInstance(target, instance): void {
  Object.defineProperties(target.prototype, Object.getOwnPropertyDescriptors(instance));
}

function mappingProperty(target, baseCtor): void {
  Object
    .getOwnPropertyNames(baseCtor.prototype)
    .filter((name) => name !== 'constructor')
    .forEach((name) => {
      const descriptor = Object.getOwnPropertyDescriptor(baseCtor.prototype, name);
      try {
        // Deep copy object fields.
        descriptor.value = JSON.parse(JSON.stringify(descriptor.value));
      } catch (e) {
      }

      Object.defineProperty(target.prototype, name, descriptor);
    });
}
