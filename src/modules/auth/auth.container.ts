import { Container } from 'inversify';

import {AppComponent} from '../../core/constants/index.js';
import {
  AuthService,
  DefaultAuthService,
  AuthExceptionFilter
} from './index.js';
import { ExceptionFilter } from '../../libs/exception-filter/index.js';

export function createAuthContainer() {
  const authContainer = new Container();
  authContainer.bind<AuthService>(AppComponent.AuthService).to(DefaultAuthService).inSingletonScope();
  authContainer.bind<ExceptionFilter>(AppComponent.AuthExceptionFilter).to(AuthExceptionFilter).inSingletonScope();

  return authContainer;
}
