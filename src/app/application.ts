import {injectable, inject} from 'inversify';
import express, { Express } from 'express';
import cors from 'cors';

import {LoggerInterface} from '../core/logger/index.js';
import {ConfigInterface} from '../core/config/index.js';
import {DatabaseClientInterface} from '../core/database-client/index.js';
import {RestSchema} from '../core/types/index.js';
import {AppComponent} from '../core/constants/index.js';
import {
  getMongoURI,
  getFullServerPath
} from '../helpers/index.js';
import {ExceptionFilter} from '../libs/exception-filter/index.js';
import {Controller} from '../libs/controller/index.js';
import {
  STATIC_UPLOAD_ROUTE,
  STATIC_FILES_ROUTE
} from './index.js';
import {getPath} from '../helpers/index.js';

@injectable()
export default class Application {
  private readonly server: Express;

  constructor(
    @inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(AppComponent.ConfigInterface) private readonly config: ConfigInterface<RestSchema>,
    @inject(AppComponent.DatabaseClientInterface) private readonly databaseClient: DatabaseClientInterface,
    @inject(AppComponent.ExceptionFilter) private readonly appExceptionFilter: ExceptionFilter,
    @inject(AppComponent.HttpExceptionFilter) private readonly httpExceptionFilter: ExceptionFilter,
    @inject(AppComponent.ValidationExceptionFilter) private readonly validationExceptionFilter: ExceptionFilter,
    @inject(AppComponent.UserController) private readonly userController: Controller,
    @inject(AppComponent.OfferController) private readonly offerController: Controller,
    @inject(AppComponent.FavoriteController) private readonly favoriteController: Controller,
    @inject(AppComponent.CommentController) private readonly commentController: Controller,
    @inject(AppComponent.RefreshTokenController) private readonly refreshTokenController: Controller,
    @inject(AppComponent.AuthExceptionFilter) private readonly authExceptionFilter: ExceptionFilter
  ) {
    this.server = express();
  }

  private async _initDb() {
    const mongoUri = getMongoURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
    );

    return this.databaseClient.connect(mongoUri);
  }

  private async _initServer() {
    const port = this.config.get('PORT');
    this.server.listen(port);
  }

  private async _initControllers() {
    this.server.use('/users', this.userController.router);
    this.server.use('/offers',this.offerController.router);
    this.server.use('/favorites', this.favoriteController.router);
    this.server.use('/comments', this.commentController.router);
    this.server.use('/refresh', this.refreshTokenController.router);
  }

  private async _initMiddleware() {
    this.server.use(express.json());
    this.server.use(
      STATIC_UPLOAD_ROUTE,
      express.static(getPath(this.config.get('UPLOAD_DIRECTORY')))
    );
    this.server.use(
      STATIC_FILES_ROUTE,
      express.static(getPath(this.config.get('STATIC_DIRECTORY_PATH')))
    );
    this.server.use(cors());
  }

  private async _initExceptionFilters() {
    this.server.use(this.authExceptionFilter.catch.bind(this.authExceptionFilter));
    this.server.use(this.validationExceptionFilter.catch.bind(this.validationExceptionFilter));
    this.server.use(this.httpExceptionFilter.catch.bind(this.httpExceptionFilter));
    this.server.use(this.appExceptionFilter.catch.bind(this.appExceptionFilter));
  }

  public async init() {
    this.logger.info('Application initialization.');

    this.logger.info('Init database.');
    await this._initDb();
    this.logger.info('Init database completed');

    this.logger.info('Init app-level middleware');
    await this._initMiddleware();
    this.logger.info('App-level middleware initialization completed');

    this.logger.info('Init controllers');
    await this._initControllers();
    this.logger.info('Controller initialization completed');

    this.logger.info('Init exception filters');
    await this._initExceptionFilters();
    this.logger.info('Exception filters initialization compleated');

    this.logger.info('Try to init server');
    await this._initServer();
    this.logger.info(`Server started on ${getFullServerPath(this.config.get('HOST'), this.config.get('PORT'))}`);
  }
}
