import {TypeUserList} from '../../../core/types/index.js';

export default class CreateUserDto {
  public name!: string;
  public email!: string;
  public avatarUser?: string;
  public password!: string;
  public typeUser!: TypeUserList;
}
