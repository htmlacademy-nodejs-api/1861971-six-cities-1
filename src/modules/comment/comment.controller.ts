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
import { AppComponent } from '../../core/constants/index.js';
import { LoggerInterface } from '../../core/logger/index.js';
import { excludeExtraneousValues } from '../../helpers/index.js';
import {
  CommentServiceInterface,
  shemeCreatComment
} from './index.js';
import {ParamOfferId} from '../offer/index.js';
import CommentRdo from './rdo/comment.rdo.js';
import CreateCommentDto from './dto/create-comment.dto.js';
import {
  ValidateObjectIdMiddleware,
  ValidateDtoMiddleware
} from '../../libs/middleware/index.js';

@injectable()
export class CommentController extends BaseController {
  constructor(
    @inject(AppComponent.LoggerInterface) protected readonly logger: LoggerInterface,
    @inject(AppComponent.CommentServiceInterface) protected readonly commentService: CommentServiceInterface
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
      path: '/creat/:offerId',
      method: HttpMethod.Post,
      handler: this.creat,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(shemeCreatComment)
      ]
    });
  }

  public async creat(
    {body, params:{offerId} }: Request<ParamOfferId, unknown, CreateCommentDto>,
    res: Response,
  ): Promise<void> {

    const dataComment = await this.commentService.create({
      ...body,
      offerId
    });
    this.ok(res, excludeExtraneousValues(CommentRdo, dataComment));
  }

  public async index(
    { params:{offerId} }: Request<ParamOfferId>,
    res: Response,
  ): Promise<void> {

    const commentsList = await this.commentService.findByOfferId(offerId);
    this.ok(res, excludeExtraneousValues(CommentRdo, commentsList));
  }

}
