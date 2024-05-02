import {
  inject,
  injectable
} from 'inversify';
import * as Mongoose from 'mongoose';
import { setTimeout } from 'node:timers/promises';

import { DatabaseClientInterface } from './index.js';
import {
  AppComponent,
  ConnectionValue
} from '../constants/index.js';
import { LoggerInterface } from '../logger/index.js';

const {RetryCount, RetryTimeout} = ConnectionValue;

@injectable()
export default class MongoClientService implements DatabaseClientInterface {
  private isConnected = false;
  private mongooseInstance: typeof Mongoose | null = null;

  constructor(
    @inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface
  ) {}

  private async _connectWithRetry(uri: string): Promise<void> {
    let attempt = 0;
    while (attempt < RetryCount) {
      try {
        this.mongooseInstance = await Mongoose.connect(uri);
        return;
      } catch (error) {
        attempt++;
        this.logger.error(`Failed to connect to the database. Attempt ${attempt}`);
        await setTimeout(RetryTimeout);
      }
    }

    this.logger.error(`Unable to establish database connection after ${attempt}`);
    throw new Error('Error on initial connection');
  }


  private async _connect(uri:string): Promise<void> {
    await this._connectWithRetry(uri);
    this.isConnected = true;
  }


  private async _disconnect(): Promise<void> {
    await this.mongooseInstance?.disconnect();
    this.isConnected = false;
    this.mongooseInstance = null;
  }


  public async connect(uri: string): Promise<void> {
    if (this.isConnected) {
      throw new Error('MongoDB client already connected');
    }

    this.logger.info('Trying to connect to MongoDB.');
    await this._connect(uri);
    this.logger.info('Database connection established.');
  }


  public async disconnect(): Promise<void> {
    if (!this.isConnected) {
      throw new Error('Not connected to the database');
    }

    await this._disconnect();
    this.logger.info('Database connection closed.');
  }
}
