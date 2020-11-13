import 'reflect-metadata';
import { RuntimeTypeLevel } from './runtime-type-level.enum';

import { RuntimeTypeOptions } from './runtime-type-options.interface';
import { TypeParamItem } from './type-param-item.interface';
import {
  getParamNames,
  outputErrorMessage,
  RUNTIME_CHECK_OPTIONS_KEY,
  RUNTIME_CHECK_OPTIONS_TARGET,
  RUNTIME_CHECK_PARAM_KEY,
  validate,
} from './utils';

export const RuntimeType = (options: RuntimeTypeOptions = {}) => {
  const globalOptions = Reflect.getOwnMetadata(RUNTIME_CHECK_OPTIONS_KEY, RUNTIME_CHECK_OPTIONS_TARGET) || {};
  const opts: RuntimeTypeOptions = {
    level: RuntimeTypeLevel.Error,
    ...globalOptions,
    ...options,
  };

  return (target: any, methodName: string, descriptor: PropertyDescriptor) => {
    const paramNames = getParamNames(target[methodName]);
    const params: TypeParamItem[] = Reflect.getOwnMetadata(RUNTIME_CHECK_PARAM_KEY, target, methodName) || [];

    return {
      ...descriptor,
      value: (...args: any[]): any => {
        for (const { index, type } of params.reverse()) {
          const paramValue = args[index];
          const paramName = paramNames[index];
          const error = validate(paramName, paramValue, type);
          if (error) {
            outputErrorMessage(opts, error);
          }
        }

        descriptor.value.apply(target, args);
      },
    };
  };
};
