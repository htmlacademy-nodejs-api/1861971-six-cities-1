import {injectable, inject} from 'inversify';

import {LoggerInterface} from '../core/logger/index.js';
import {ConfigInterface} from '../core/config/index.js';
import {DatabaseClientInterface} from '../core/database-client/index.js';
import {RestSchema} from '../core/types/index.js';
import {AppComponent} from '../core/constants/index.js';
import {getMongoURI} from '../helpers/index.js';

@injectable()
export default class Application {
  constructor(
    @inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(AppComponent.ConfigInterface) private readonly config: ConfigInterface<RestSchema>,
    @inject(AppComponent.DatabaseClientInterface) private readonly databaseClient: DatabaseClientInterface
  ) {}

  private async _initDb() {
    const mongoUri = getMongoURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
    );

    return this.databaseClient.connect(mongoUri);
  }

  public async init() {
    this.logger.info('Application initialization.');
    this.logger.info(`Get value from file .env $PORT: ${this.config.get('PORT')}`);

    this.logger.info('Init database.');
    await this._initDb();
    this.logger.info('Init database completed');
  }
}
