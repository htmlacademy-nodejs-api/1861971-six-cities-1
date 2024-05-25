import {
  inject,
  injectable
} from 'inversify';
import {
  Response,
  Request
} from 'express';

import {BaseController} from '../../libs/controller/index.js';
import {HttpMethod} from '../../libs/constants/index.js';
import {
  AppComponent,
  NameActions
} from '../../core/constants/index.js';
import { LoggerInterface } from '../../core/logger/index.js';
import { ConfigInterface } from '../../core/config/index.js';
import {RestSchema} from '../../core/types/index.js';
import {
  UserServiceInterface,
  CreateUserRequest,
  schemeUser
} from './index.js';
import {
  excludeExtraneousValues,
  getErrorConflict
} from '../../helpers/index.js';
import UserRdo from './rdo/user.rdo.js';
import {
  ValidateDtoMiddleware,
  ValidateObjectIdMiddleware,
  UploadFileMiddleware
} from '../../libs/middleware/index.js';

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
    this.addRoute({
      path: '/:userId/avatar',
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new ValidateObjectIdMiddleware('userId'),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'avatar'),
      ]
    });
  }

  public async create(
    { body }: CreateUserRequest,
    res: Response,
  ): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.email);

    if (existsUser) {
      getErrorConflict(body.email, NameActions.CreatUser);
    }

    const result = await this.userService.create(body, this.configService.get('SALT'));
    this.created(res, excludeExtraneousValues(UserRdo, result));
  }

  public async uploadAvatar(
    {file}: Request,
    res: Response
  ) {
    this.created(res, {filepath: file?.path});
  }
}
