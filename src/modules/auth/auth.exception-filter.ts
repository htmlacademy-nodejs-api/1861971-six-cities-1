import {
  inject,
  injectable
} from 'inversify';
import {
  NextFunction,
  Request,
  Response
} from 'express';

import { ExceptionFilter } from '../../libs/exception-filter/index.js';
import {AppComponent} from '../../core/constants/index.js';
import {LoggerInterface} from '../../core/logger/index.js';
import { BaseUserException } from './errors/index.js';

@injectable()
export class AuthExceptionFilter implements ExceptionFilter {
  constructor(
    @inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface
  ) {
    this.logger.info('Register AuthExceptionFilter');
  }

  public catch(error: unknown, _req: Request, res: Response, next: NextFunction): void {
    if (! (error instanceof BaseUserException)) {
      return next(error);
    }

    this.logger.error(`[AuthModule] ${error.message}`, error);
    res.status(error.httpStatusCode)
      .json({
        type: 'AUTHORIZATION',
        error: error.message,
      });
  }
}
