import {
  injectable,
  inject
} from 'inversify';
import { StatusCodes } from 'http-status-codes';
import {
  Response,
  Router
} from 'express';
import asyncHandler from 'express-async-handler';

import { Controller } from './index.js';
import { LoggerInterface } from '../../core/logger/index.js';
import { Route } from '../types/route.interface.js';
import {DefaultValues} from '../constants/index.js';
import {AppComponent} from '../../core/constants/index.js';
import {PathTransformer} from '../../libs/transform/index.js';

const {DefaultContentType} = DefaultValues;

@injectable()
export abstract class BaseController implements Controller {
  private readonly _router: Router;

  @inject(AppComponent.PathTransformer)
  private pathTransformer!: PathTransformer;

  constructor(
    protected readonly logger: LoggerInterface
  ) {
    this._router = Router();
  }

  get router() {
    return this._router;
  }

  public addRoute(route: Route) {
    const wrapperAsyncHandler = asyncHandler(route.handler.bind(this));
    const middlewareHandlers = route.middlewares?.map(
      (middleware) => asyncHandler(middleware.execute.bind(middleware))
    );
    const allHandlers = middlewareHandlers ? [...middlewareHandlers, wrapperAsyncHandler] : wrapperAsyncHandler;

    this._router[route.method](route.path, allHandlers);
    this.logger.info(`Route registered: ${route.method.toUpperCase()} ${route.path}`);
  }

  public send<T>(res: Response, statusCode: number, data: T): void {
    const modifiedData = this.pathTransformer.execute(data as Record<string, unknown>);
    res
      .type(DefaultContentType)
      .status(statusCode)
      .json(modifiedData);
  }

  public created<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.CREATED, data);
  }

  public noContent<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.NO_CONTENT, data);
  }

  public ok<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.OK, data);
  }
}
