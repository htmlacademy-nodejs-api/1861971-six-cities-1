import {
  inject,
  injectable
} from 'inversify';
import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import {BaseController} from '../../libs/controller/index.js';
import {HttpMethod} from '../../libs/constants/index.js';
import {HttpError} from '../../libs/errors/index.js';
import { AppComponent } from '../../core/constants/index.js';
import { LoggerInterface } from '../../core/logger/index.js';
import { ConfigInterface } from '../../core/config/index.js';
import {RestSchema} from '../../core/types/index.js';
import {
  UserServiceInterface,
  CreateUserRequest,
  schemeUser
} from './index.js';
import { excludeExtraneousValues } from '../../helpers/index.js';
import UserRdo from './rdo/user.rdo.js';
import {ValidateDtoMiddleware} from '../../libs/middleware/validate-dto.middleware.js';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(AppComponent.LoggerInterface) protected readonly logger: LoggerInterface,
    @inject(AppComponent.UserServiceInterface) private readonly userService: UserServiceInterface,
    @inject(AppComponent.ConfigInterface) private readonly configService: ConfigInterface<RestSchema>,
  ) {
    super(logger);
    this.logger.info('Register routes for UserController…');

    this.addRoute({
      path: '/register',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(schemeUser)]
    });
  }

  public async create(
    { body }: CreateUserRequest,
    res: Response,
  ): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.email);

    if (existsUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email ${body.email} exists.`,
        'UserController'
      );
    }

    const result = await this.userService.create(body, this.configService.get('SALT'));
    this.created(res, excludeExtraneousValues(UserRdo, result));
  }

}
