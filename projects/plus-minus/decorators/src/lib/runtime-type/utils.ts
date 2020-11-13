import { levelStrategies } from './level.strategy';
import { RuntimeTypeOptions } from './runtime-type-options.interface';
import { ValidateError } from './validate-error.interface';

export const RUNTIME_CHECK_OPTIONS_KEY = Symbol('__pm_runtime_check_options_key__');

export const RUNTIME_CHECK_PARAM_KEY = Symbol('__pm_runtime_check_type_key__');

export const RUNTIME_CHECK_OPTIONS_TARGET = class TargetOptions {
};

export const ARGUMENT_NAMES = /([^\s,]+)/g;

export const STRIP_COMMENTS = /(\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s*=[^,\)]*(('(?:\\'|[^'\r\n])*')|("(?:\\"|[^"\r\n])*"))|(\s*=[^,\)]*))/mg;

export const getTypeName = (type): string => {
  if (typeof type === 'function' && type.name) {
    return type.name;
  } else if (null !== type && typeof type === 'object' && 'constructor' in type) {
    return type.constructor.name;
  }

  return Object.prototype.toString.call(type).slice(8, -1);
};

export const getParamNames = (func): string[] => {
  const fnStr = func.toString().replace(STRIP_COMMENTS, '');
  return fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES) || [];
};

export const setGlobalRuntimeTypeOptions = (options: RuntimeTypeOptions = {}) => {
  const opts = Reflect.getOwnMetadata(RUNTIME_CHECK_OPTIONS_KEY, RUNTIME_CHECK_OPTIONS_TARGET) || {};
  Reflect.defineMetadata(RUNTIME_CHECK_OPTIONS_KEY, { ...opts, ...options }, RUNTIME_CHECK_OPTIONS_TARGET);
};

export const validate = (prop: string, propValue: any, type: any): ValidateError | null => {
  const actual = getTypeName(propValue);
  const expect = getTypeName(type);
  const isInstance = propValue instanceof type;

  if (!isInstance && actual !== expect) {
    return { prop, expect, actual };
  }

  return null;
};

export const outputErrorMessage = (opts: RuntimeTypeOptions, error: ValidateError): void => {
  const levelOutputStrategy = levelStrategies[opts.level];
  if (levelOutputStrategy) {
    levelOutputStrategy(error);
  } else {
    console.warn(`Level: No strategy found '${ opts.level }'!`);
  }
};
