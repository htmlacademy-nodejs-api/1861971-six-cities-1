import {
  inject,
  injectable
} from 'inversify';
import { StatusCodes } from 'http-status-codes';
import {
  NextFunction,
  Request,
  Response
} from 'express';

import { ExceptionFilter } from './exception-filter.interface.js';
import { AppComponent } from '../../core/constants/index.js';
import { LoggerInterface } from '../../core/logger/index.js';
import { HttpError } from '../errors/index.js';
import { createErrorObject } from '../../helpers/index.js';
import { ApplicationError } from '../types/index.js';

@injectable()
export class HttpErrorExceptionFilter implements ExceptionFilter {
  constructor(
    @inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface
  ) {
    this.logger.info('Register HttpErrorExceptionFilter');
  }

  public catch(error: unknown, req: Request, res: Response, next: NextFunction): void {
    if (!(error instanceof HttpError)) {
      return next(error);
    }

    this.logger.error(`[HttpErrorException]: ${req.path} # ${error.message}`, error);

    res
      .status(StatusCodes.PAYMENT_REQUIRED)
      .json(createErrorObject(ApplicationError.CommonError, error.message));
  }
}
