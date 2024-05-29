import { Container } from 'inversify';

import {AppComponent} from '../../core/constants/index.js';
import {
  RefreshTokenService,
  DefaultRefreshTokenService,
  RefreshTokenController
} from './index.js';
import {Controller} from '../../libs/controller/index.js';

export function createRefreshTokenContainer() {
  const refreshTokenContainer = new Container();
  refreshTokenContainer.bind<RefreshTokenService>(AppComponent.RefreshTokenService).to(DefaultRefreshTokenService).inSingletonScope();
  refreshTokenContainer.bind<Controller>(AppComponent.RefreshTokenController).to(RefreshTokenController).inSingletonScope();
  return refreshTokenContainer;
}
