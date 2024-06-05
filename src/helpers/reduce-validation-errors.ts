import {ValidationError} from 'joi';
import {ValidationErrorField} from '../libs/types/index.js';

export function reduceValidationErrors(errors: ValidationError): ValidationErrorField[] {
  return errors.details.map(({context, message}) => ({
    property: context?.key as string,
    value: context?.value as string,
    message
  }));
}
