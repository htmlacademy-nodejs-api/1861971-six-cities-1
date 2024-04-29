import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';

import { UserServiceInterface } from './index.js';
import UserService from './user.service.js';
import {
  UserEntity,
  UserModel
} from './user.entity.js';
import { AppComponent } from '../../core/constants/index.js';

export function createUserContainer() {
  const userContainer = new Container();
  userContainer.bind<UserServiceInterface>(AppComponent.UserServiceInterface).to(UserService).inSingletonScope();
  userContainer.bind<types.ModelType<UserEntity>>(AppComponent.UserModel).toConstantValue(UserModel);

  return userContainer;
}
