import { OverridePropsOptions } from './override-props-options.interface';

/**
 * The decorator overrides the properties in the calling context
 * and executes the method, then returns the previous property values.
 */
export const OverrideProps = (props: OverridePropsOptions): (...args: any[]) => any => {
  return (target: any, key: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
    return {
      ...descriptor,
      value: function wrapper(): any {
        let prevProps = {};

        Object
          .keys(props)
          .forEach((k: string) => {
            prevProps[k] = this[k];
            this[k] = props[k];
          });

        const method = descriptor.value.apply(this, arguments);

        Object
          .keys(prevProps)
          .forEach((k: string) => {
            this[k] = prevProps[k];
            prevProps = null;
          });

        return method;
      },
    };
  };
};
