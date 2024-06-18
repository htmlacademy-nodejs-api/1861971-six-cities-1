import {
  inject,
  injectable
} from 'inversify';
import {
  Response,
  Request
} from 'express';

import {BaseController} from '../../libs/controller/index.js';
import {HttpMethod} from '../../libs/constants/index.js';
import {
  AppComponent,
  NameActions
} from '../../core/constants/index.js';
import { LoggerInterface } from '../../core/logger/index.js';
import {
  excludeExtraneousValues,
  getErrorConflict
} from '../../helpers/index.js';
import {
  CommentServiceInterface,
  shemeCreatComment
} from './index.js';
import {ParamOfferId} from '../offer/index.js';
import CommentRdo from './rdo/comment.rdo.js';
import {
  ValidateObjectIdMiddleware,
  ValidateDtoMiddleware,
  PrivateRouteMiddleware,
  ParseTokenMiddleware
} from '../../libs/middleware/index.js';
import {UserServiceInterface} from '../user/index.js';
import {ConfigInterface} from '../../core/config/index.js';
import {RestSchema} from '../../core/types/index.js';

@injectable()
export class CommentController extends BaseController {
  constructor(
    @inject(AppComponent.LoggerInterface) protected readonly logger: LoggerInterface,
    @inject(AppComponent.CommentServiceInterface) protected readonly commentService: CommentServiceInterface,
    @inject(AppComponent.UserServiceInterface) private readonly userService: UserServiceInterface,
    @inject(AppComponent.ConfigInterface) private readonly configService: ConfigInterface<RestSchema>
  ) {
    super(logger);
    this.logger.info('Register routes for CommentController…');

    this.addRoute({
      path: '/list/:offerId',
      method: HttpMethod.Get,
      handler: this.index,
      middlewares: [new ValidateObjectIdMiddleware('offerId')]
    });
    this.addRoute({
      path: '/create/:offerId',
      method: HttpMethod.Post,
      handler: this.creat,
      middlewares: [
        new ParseTokenMiddleware(this.configService.get('JWT_ACCESS_SECRET')),
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(shemeCreatComment)
      ]
    });
  }

  public async creat(
    {body, params:{offerId}, tokenPayload:{email, id} }: Request<ParamOfferId, unknown, { comment: string, rating: number }>,
    res: Response,
  ): Promise<void> {
    const registrationUser = await this.userService.findByEmail(email);

    if (!registrationUser) {
      getErrorConflict(email, NameActions.CheckRegistrationUser);
    }

    const dataComment = await this.commentService.create({
      text: body.comment,
      rating: body.rating,
      authorOfOffer: id,
      offerId: offerId,
      datePublication: ''
    });
    this.created(res, excludeExtraneousValues(CommentRdo, dataComment));
  }

  public async index(
    { params:{offerId} }: Request<ParamOfferId>,
    res: Response,
  ): Promise<void> {

    const commentsList = await this.commentService.findByOfferId(offerId);
    this.ok(res, excludeExtraneousValues(CommentRdo, commentsList));
  }

}
