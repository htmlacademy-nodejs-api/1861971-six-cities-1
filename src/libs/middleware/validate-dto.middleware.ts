import {
  NextFunction,
  Request,
  Response
} from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  ObjectSchema,
} from 'joi';

import { Middleware } from './middleware.interface.js';

type ErrorValidate = {
  details: {message: string}[];
}


export class ValidateDtoMiddleware implements Middleware {
  constructor(private validateDto: ObjectSchema) {}

  public async execute({ body }: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.validateDto.validateAsync(body, {abortEarly: false});
    } catch(err) {
      const {details} = err as ErrorValidate;
      res.status(StatusCodes.BAD_REQUEST).send({
        message: details.map((errorDescription) => errorDescription.message),
        data: body,
      });
      return;
    }

    next();
  }
}
