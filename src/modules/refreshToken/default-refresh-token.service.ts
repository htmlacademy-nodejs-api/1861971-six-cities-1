import {
  inject,
  injectable }
  from 'inversify';
import {createSecretKey} from 'node:crypto';
import { SignJWT } from 'jose';

import {
  RefreshTokenService,
} from './index.js';
import {AppComponent} from '../../core/constants/index.js';
import {LoggerInterface} from '../../core/logger/index.js';
import {ConfigInterface} from '../../core/config/index.js';
import {RestSchema} from '../../core/types/index.js';
import {
  TokenPayload,
  JWT_ALGORITHM,
  JWT_TYP
} from '../auth/index.js';
import {UserEntity} from '../user/index.js';

@injectable()
export class DefaultRefreshTokenService implements RefreshTokenService {
  constructor(
    @inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(AppComponent.ConfigInterface) private readonly config: ConfigInterface<RestSchema>,
  ) {}

  public async authenticate(user: UserEntity): Promise<string> {
    const jwtSecret = this.config.get('JWT_REFRESH_SECRET');
    const secretKey = createSecretKey(jwtSecret, 'utf-8');
    const tokenPayload: TokenPayload = {
      name: user.name,
      email: user.email,
      id: user.id,
    };

    this.logger.info(`Create refreshToken for ${user.email}`);
    return new SignJWT(tokenPayload)
      .setProtectedHeader({
        alg: JWT_ALGORITHM,
        typ: JWT_TYP
      })
      .setIssuedAt()
      .sign(secretKey);
  }
}
