import { UserRdo } from '../user';

export class CommentRdo{
  public id!: string;
  public text!: string;
  public rating!: number;
  public authorOfOffer!: UserRdo;
  public createdAt!: string;
}
