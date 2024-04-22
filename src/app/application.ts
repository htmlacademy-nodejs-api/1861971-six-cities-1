import {injectable, inject} from 'inversify';

import {LoggerInterface} from '../core/logger/index.js';
import {ConfigInterface} from '../core/config/index.js';
import {RestSchema} from '../core/types/index.js';
import {AppComponent} from '../core/constants/index.js';

@injectable()
export default class Application {
  constructor(
    @inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(AppComponent.ConfigInterface) private readonly config: ConfigInterface<RestSchema>,
  ) {}

  public async init() {
    this.logger.info('Application initialization.');
    this.logger.info(`Get value from file .env $PORT: ${this.config.get('PORT')}`);
    this.logger.info(`Get value from file .env $DB_ADDRESS: ${this.config.get('DB_ADDRESS')}`);
    this.logger.info(`Get value from file .env $SOLT: ${this.config.get('SOLT')}`);
  }
}
