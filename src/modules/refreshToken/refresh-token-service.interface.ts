import {UserEntity} from '../user/index.js';

export interface RefreshTokenService {
  authenticate(user: UserEntity): Promise<string>;
}
