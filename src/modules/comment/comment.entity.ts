import {
  defaultClasses,
  getModelForClass,
  Ref,
  prop,
  modelOptions
} from '@typegoose/typegoose';

import { UserEntity } from '../user/index.js';
import {OfferEntity} from '../offer/index.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface CommentEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'comments'
  }
})

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class CommentEntity extends defaultClasses.TimeStamps {
  @prop({required: true,
    minlength: 5,
    maxlength: 1024
  })
  public text!: string;

  @prop({
    required: true,
    min: 1,
    max: 5
  })
  public rating!: number;

  @prop({
    required: true,
    ref: () => UserEntity
  })
  public authorOfOffer!: Ref<UserEntity>;

  @prop({
    required: true,
    ref: () => OfferEntity
  })
  public offerId!: Ref<OfferEntity>;
}

export const CommentModel = getModelForClass(CommentEntity);
