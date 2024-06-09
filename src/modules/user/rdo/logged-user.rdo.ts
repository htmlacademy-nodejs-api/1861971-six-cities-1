import { Expose } from 'class-transformer';

export default class LoggedUserRdo {
  @Expose()
  public token!: string;

  @Expose()
  public refreshToken!: string;

  @Expose()
  public name!: string ;

  @Expose()
  public email!: string;

  @Expose()
  public avatarUser!: string;

  @Expose()
  public typeUser!: string;
}
