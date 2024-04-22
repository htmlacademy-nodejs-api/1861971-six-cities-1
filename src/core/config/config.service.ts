import { config } from 'dotenv';
import {injectable, inject} from 'inversify';

import {ConfigInterface} from './config.interface.js';
import {LoggerInterface} from '../logger/index.js';
import {configRestSchema} from './index.js';
import {RestSchema} from '../types/index.js';
import {getErrorMessage} from '../../helpers/index.js';
import {AppComponent} from '../constants/index.js';

@injectable()
export default class ConfigService implements ConfigInterface<RestSchema> {
  private readonly config: RestSchema;

  constructor(
    @inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface,
  ) {
    const parsedOutput = config();

    if (parsedOutput.error) {
      throw new Error(getErrorMessage(parsedOutput.error));
    }

    configRestSchema.load({});
    configRestSchema.validate({ allowed: 'strict', output: this.logger.error });

    this.config = configRestSchema.getProperties();
    this.logger.info('.env file found and successfully parsed!');
  }

  public get<T extends keyof RestSchema>(key: T): RestSchema[T] {
    return this.config[key];
  }
}
