import {
  ApplicationError,
  ValidationErrorField
} from '../libs/types/index.js';

export function createErrorObject(errorType: ApplicationError, error: string, details: ValidationErrorField[] = []) {
  return { errorType, error, details };
}
