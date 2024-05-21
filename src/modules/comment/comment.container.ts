import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';

import { AppComponent } from '../../core/constants/index.js';
import {
  CommentServiceInterface,
  CommentEntity,
  CommentModel,
  CommentController
} from './index.js';
import CommentService from './comment.service.js';
import {Controller} from '../../libs/controller/index.js';

export function createCommentContainer() {
  const commentContainer = new Container();

  commentContainer.bind<CommentServiceInterface>(AppComponent.CommentServiceInterface).to(CommentService).inSingletonScope();
  commentContainer.bind<types.ModelType<CommentEntity>>(AppComponent.CommentModel).toConstantValue(CommentModel);
  commentContainer.bind<Controller>(AppComponent.CommentController).to(CommentController).inSingletonScope();

  return commentContainer;
}
