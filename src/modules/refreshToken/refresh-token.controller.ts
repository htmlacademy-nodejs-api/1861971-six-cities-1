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
  UserEntity
} from '../user/index.js';
import {
  getErrorConflict,
  excludeExtraneousValues
} from '../../helpers/index.js';
import {
  ParseTokenMiddleware,
  PrivateRouteMiddleware
} from '../../libs/middleware/index.js';
import {AuthService} from '../auth/index.js';
import {RefreshTokenService} from './index.js';
import LoggedUserRdo from '../user/rdo/logged-user.rdo.js';

@injectable()
export class RefreshTokenController extends BaseController {
  constructor(
    @inject(AppComponent.LoggerInterface) protected readonly logger: LoggerInterface,
    @inject(AppComponent.UserServiceInterface) private readonly userService: UserServiceInterface,
    @inject(AppComponent.ConfigInterface) private readonly configService: ConfigInterface<RestSchema>,
    @inject(AppComponent.AuthService) private readonly authService: AuthService,
    @inject(AppComponent.RefreshTokenService) private readonly refreshTokenService: RefreshTokenService
  ) {
    super(logger);
    this.logger.info('Register routes for RefreshTokenController…');

    this.addRoute({
      path: '/login',
      method: HttpMethod.Post,
      handler: this.login,
      middlewares: [
        new ParseTokenMiddleware(this.configService.get('JWT_REFRESH_SECRET')),
        new PrivateRouteMiddleware()
      ]
    });
  }

  public async login(
    { tokenPayload:{email} }: Request,
    res: Response,
  ): Promise<void> {
    const existsUser = await this.userService.findByEmail(email);

    if (!existsUser) {
      getErrorConflict(email, NameActions.CreatUser);
    }

    const token = await this.authService.authenticate(existsUser as UserEntity);
    const refreshToken = await this.refreshTokenService.authenticate(existsUser as UserEntity);

    this.created(res, excludeExtraneousValues(LoggedUserRdo, {token, refreshToken}));
  }
}
