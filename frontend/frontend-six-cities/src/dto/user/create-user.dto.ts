import { UserType } from '../../const';

export class CreateUserDto {
  public name!: string;
  public email!: string;
  public avatarUser?: string;
  public password!: string;
  public typeUser!: UserType;
}
