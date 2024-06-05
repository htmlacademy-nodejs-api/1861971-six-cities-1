import {
  inject,
  injectable }
  from 'inversify';
import {createSecretKey} from 'node:crypto';
import { SignJWT } from 'jose';

import {
  AuthService,
  TokenPayload,
  DataJWTList
} from './index.js';
import {AppComponent} from '../../core/constants/index.js';
import {LoggerInterface} from '../../core/logger/index.js';
import {
  UserEntity,
  UserServiceInterface
} from '../user/index.js';
import LoginUserDto from '../user/dto/login-user.dto.js';
import {ConfigInterface} from '../../core/config/index.js';
import {RestSchema} from '../../core/types/index.js';
import {
  UserNotFoundException,
  UserPasswordIncorrectException
} from './errors/index.js';

@injectable()
export class DefaultAuthService implements AuthService {
  constructor(
    @inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(AppComponent.UserServiceInterface) private readonly userService: UserServiceInterface,
    @inject(AppComponent.ConfigInterface) private readonly config: ConfigInterface<RestSchema>,
  ) {}

  public async authenticate(user: UserEntity): Promise<string> {
    const jwtSecret = this.config.get('JWT_ACCESS_SECRET');
    const secretKey = createSecretKey(jwtSecret, 'utf-8');
    const tokenPayload: TokenPayload = {
      name: user.name,
      email: user.email,
      id: user.id,
    };

    this.logger.info(`Create token for ${user.email}`);
    return new SignJWT(tokenPayload)
      .setProtectedHeader({
        alg: DataJWTList.JWT_ALGORITHM,
        typ: DataJWTList.JWT_TYP
      })
      .setIssuedAt()
      .setExpirationTime(DataJWTList.JWT_EXPIRED)
      .sign(secretKey);
  }

  public async verify(dto: LoginUserDto): Promise<UserEntity> {
    const user = await this.userService.findByEmail(dto.email);
    if (! user) {
      this.logger.warn(`User with ${dto.email} not found`);
      throw new UserNotFoundException();
    }

    if (! user.verifyPassword(dto.password, this.config.get('SALT'))) {
      this.logger.warn(`Incorrect password for ${dto.email}`);
      throw new UserPasswordIncorrectException();
    }

    return user;
  }


}
