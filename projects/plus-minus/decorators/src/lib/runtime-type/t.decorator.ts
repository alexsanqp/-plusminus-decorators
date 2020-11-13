import 'reflect-metadata';

import { TypeParamItem } from './type-param-item.interface';
import { RUNTIME_CHECK_PARAM_KEY } from './utils';

export const T = (type: any) => {
  return (target, propName, index?: number) => {
    if (typeof index !== 'undefined') {
      const params: TypeParamItem[] = Reflect.getOwnMetadata(RUNTIME_CHECK_PARAM_KEY, target, propName) || [];

      params.push({ index, type });

      Reflect.defineMetadata(RUNTIME_CHECK_PARAM_KEY, params, target, propName);
    }
  };
};
