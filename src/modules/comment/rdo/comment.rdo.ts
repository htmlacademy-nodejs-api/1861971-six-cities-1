import {
  Expose,
  Type
} from 'class-transformer';

import UserRdo from '../../user/rdo/user.rdo.js';

export default class CommentRdo{
  @Expose()
  public text!: string;

  @Expose()
  public rating!: number;

  @Expose()
  @Type(() => UserRdo)
  public authorOfOffer!: Set<UserRdo>;

  @Expose()
  public createdAt!: string;
}
