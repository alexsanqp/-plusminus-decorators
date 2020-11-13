import { RuntimeTypeLevel } from './runtime-type-level.enum';
import { ValidateError } from './validate-error.interface';

export type LevelStrategy = (error: ValidateError) => void;

export const composeMessage = ({ prop, expect, actual }: ValidateError): string => {
  return `The parameter '${ prop }' must be of type '${ expect }', but not the type '${ actual }'.`;
};

export const levelStrategies: Record<RuntimeTypeLevel, LevelStrategy> = {
  [RuntimeTypeLevel.Log]: (error: ValidateError) => console.log(composeMessage(error)),
  [RuntimeTypeLevel.Warn]: (error: ValidateError) => console.warn(composeMessage(error)),
  [RuntimeTypeLevel.Error]: (error: ValidateError) => console.error(composeMessage(error)),
  [RuntimeTypeLevel.Hidden]: (error: ValidateError) => {},
  [RuntimeTypeLevel.Throw]: (error: ValidateError) => {
    throw new Error(composeMessage(error));
  },
};
