import { Container } from 'inversify';

import PinoService from '../core/logger/pino.service.js';
import Application from '../app/application.js';
import ConfigService from '../core/config/config.service.js';
import MongoClientService from '../core/database-client/mongo-client.service.js';
import {LoggerInterface} from '../core/logger/index.js';
import {ConfigInterface} from '../core/config/index.js';
import {DatabaseClientInterface} from '../core/database-client/index.js';
import {RestSchema} from '../core/types/index.js';
import {AppComponent} from '../core/constants/index.js';
import {
  ExceptionFilter,
  AppExceptionFilter
} from '../libs/exception-filter/index.js';

export function createApplicationContainer() {
  const applicationContainer = new Container();
  applicationContainer.bind<Application>(AppComponent.Application).to(Application).inSingletonScope();
  applicationContainer.bind<LoggerInterface>(AppComponent.LoggerInterface).to(PinoService).inSingletonScope();
  applicationContainer.bind<ConfigInterface<RestSchema>>(AppComponent.ConfigInterface).to(ConfigService).inSingletonScope();
  applicationContainer.bind<DatabaseClientInterface>(AppComponent.DatabaseClientInterface).to(MongoClientService).inSingletonScope();
  applicationContainer.bind<ExceptionFilter>(AppComponent.ExceptionFilter).to(AppExceptionFilter).inSingletonScope();

  return applicationContainer;
}
