import {
  defaultClasses,
  getModelForClass,
  prop,
  modelOptions
} from '@typegoose/typegoose';

import {
  User,
  TypeUserList
} from '../../core/types/index.js';
import {
  Avatar,
  imageFormats
} from '../../core/constants/index.js';
import { createSHA256 } from '../../helpers/index.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users'
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class UserEntity extends defaultClasses.TimeStamps implements User {
  @prop({
    required: true,
    minlength: 1,
    maxlength: 15
  })
  public name!: string;

  @prop({
    unique: true,
    required: true,
    match: /^([\w-\\.]+@([\w-]+\.)+[\w-]{2,4})?$/
  })
  public email!: string;

  @prop({
    default: Avatar.Default,
    validate: {
      validator: (imegeAvatar: string): boolean => {
        const values = imegeAvatar.split('.');

        if(imageFormats.find((imageFormat) => imageFormat === values[values.length - 1])){
          return true;
        }
        return false;
      },
      message: 'The user is image in the format can be "jpg" or "png"!'
    }
  })
  public avatarUser?: string;

  @prop({
    required: true
  })
  public password!: string;

  @prop({
    required: true
  })
  public typeUser!: TypeUserList;

  constructor(userData: User) {
    super();

    this.name = userData.name;
    this.email = userData.email;
    this.avatarUser = userData.avatarUser;
    this.password = userData.password;
    this.typeUser = userData.typeUser;
  }

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }

  public verifyPassword(password: string, salt: string) {
    const hashPassword = createSHA256(password, salt);
    return hashPassword === this.password;
  }

}

export const UserModel = getModelForClass(UserEntity);
