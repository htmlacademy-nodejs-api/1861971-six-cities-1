import {
  NextFunction,
  Request,
  Response
} from 'express';
import {
  ObjectSchema,
} from 'joi';

import { Middleware } from './middleware.interface.js';
import {ValidationError} from '../errors/index.js';
import {reduceValidationErrors} from '../../helpers/index.js';

export class ValidateDtoMiddleware implements Middleware {
  constructor(private validateDto: ObjectSchema) {}

  public async execute({ body, path }: Request, _res: Response, next: NextFunction): Promise<void> {
    const {error} = this.validateDto.validate(body, {abortEarly: false});

    if (error !== undefined) {
      throw new ValidationError(`Validation error: ${path}`, reduceValidationErrors(error));
    }

    next();
  }
}
