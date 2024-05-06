import {
  inject,
  injectable
} from 'inversify';
import {
  DocumentType,
  types
} from '@typegoose/typegoose';

import {
  CommentServiceInterface,
  CommentEntity
} from './index.js';
import CreateCommentDto from './dto/create-comment.dto.js';
import { AppComponent } from '../../core/constants/index.js';
import {
  SortType,
  DefaultValues
} from '../../core/constants/index.js';

@injectable()
export default class CommentService implements CommentServiceInterface {
  constructor(
    @inject(AppComponent.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>
  ) {}

  public async create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    const comment = await this.commentModel
      .create(dto);

    return comment
      .populate('userId');
  }

  public async findByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[] | null> {
    return this.commentModel
      .find({offerId})
      .sort({createdAt: SortType.Down})
      .limit(DefaultValues.CommentCount)
      .populate('userId')
      .exec();
  }
}
