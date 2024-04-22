import 'reflect-metadata';
import {Container} from 'inversify';

import PinoService from './core/logger/pino.service.js';
import Application from './app/application.js';
import ConfigService from './core/config/config.service.js';
import {LoggerInterface} from './core/logger/index.js';
import {ConfigInterface} from './core/config/index.js';
import {RestSchema} from './core/types/index.js';
import {AppComponent} from './core/constants/index.js';

async function bootstrap() {
  const container = new Container();
  container.bind<Application>(AppComponent.Application).to(Application).inSingletonScope();
  container.bind<LoggerInterface>(AppComponent.LoggerInterface).to(PinoService).inSingletonScope();
  container.bind<ConfigInterface<RestSchema>>(AppComponent.ConfigInterface).to(ConfigService).inSingletonScope();

  const application = container.get<Application>(AppComponent.Application);
  await application.init();
}

bootstrap();

