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
import { LoggerInterface } from '../../core/logger/index.js';
import { AppComponent } from '../../core/constants/index.js';
import { createErrorObject } from '../../helpers/index.js';
import {ApplicationError} from '../types/index.js';

@injectable()
export class AppExceptionFilter implements ExceptionFilter {
  constructor(
    @inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface
  ) {
    this.logger.info('Register AppExceptionFilter');
  }

  public catch(error: Error, _req: Request, res: Response, _next: NextFunction): void {
    this.logger.error(error.message, error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(createErrorObject(ApplicationError.ServiceError, error.message));
  }
}
