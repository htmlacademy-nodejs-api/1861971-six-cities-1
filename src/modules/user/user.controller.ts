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
  schemeUser,
  schemeLoginUser,
  LoginUserRequest
} from './index.js';
import {
  excludeExtraneousValues,
  getErrorConflict
} from '../../helpers/index.js';
import UserRdo from './rdo/user.rdo.js';
import LoggedUserRdo from './rdo/logged-user.rdo.js';
import UploadUserAvatarRdo from './rdo/upload-user-avatar.rdo.js';
import {
  ValidateDtoMiddleware,
  ValidateObjectIdMiddleware,
  UploadFileMiddleware,
  ParseTokenMiddleware,
  PrivateRouteMiddleware
} from '../../libs/middleware/index.js';
import {AuthService} from '../auth/index.js';
import {RefreshTokenService} from '../refreshToken/index.js';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(AppComponent.LoggerInterface) protected readonly logger: LoggerInterface,
    @inject(AppComponent.UserServiceInterface) private readonly userService: UserServiceInterface,
    @inject(AppComponent.ConfigInterface) private readonly configService: ConfigInterface<RestSchema>,
    @inject(AppComponent.AuthService) private readonly authService: AuthService,
    @inject(AppComponent.RefreshTokenService) private readonly refreshTokenService: RefreshTokenService
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
      path: '/login',
      method: HttpMethod.Post,
      handler: this.login,
      middlewares: [new ValidateDtoMiddleware(schemeLoginUser)]
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
    this.addRoute({
      path: '/login',
      method: HttpMethod.Get,
      handler: this.checkAuthenticate,
      middlewares: [
        new ParseTokenMiddleware(this.configService.get('JWT_ACCESS_SECRET')),
        new PrivateRouteMiddleware()
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

  public async login(
    { body }: LoginUserRequest,
    res: Response,
  ): Promise<void> {
    const user = await this.authService.verify(body);
    const token = await this.authService.authenticate(user);
    const refreshToken = await this.refreshTokenService.authenticate(user);
    this.ok(res, excludeExtraneousValues(LoggedUserRdo, {token, refreshToken}));
  }

  public async uploadAvatar(
    {params:{userId}, file}: Request,
    res: Response
  ) {
    const uploadFile = { avatarUser: file?.filename };

    const dataUsre = await this.userService.updateById(userId, uploadFile);
    if (!dataUsre) {
      getErrorConflict(userId, NameActions.UpdateUser);
    }

    this.created(res, excludeExtraneousValues(UploadUserAvatarRdo, {fileNameAvatar: uploadFile.avatarUser}));
  }

  public async checkAuthenticate(
    { tokenPayload: { email }}: Request,
    res: Response
  ) {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      getErrorConflict(email, NameActions.CheckAuthenticate);
    }

    this.ok(res, excludeExtraneousValues(UserRdo, user));
  }
}
