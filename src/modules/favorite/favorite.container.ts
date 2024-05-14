import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';

import {
  FavoriteEntity,
  FavoriteModel,
  FavoriteServiceInterface,
  FavoriteController
} from './index.js';
import FavoriteService from './favorite.service.js';
import { AppComponent } from '../../core/constants/index.js';
import {Controller} from '../../libs/controller/index.js';

export function createFavoriteContainer() {
  const favoriteContainer = new Container();
  favoriteContainer.bind<types.ModelType<FavoriteEntity>>(AppComponent.FavoriteModel).toConstantValue(FavoriteModel);
  favoriteContainer.bind<FavoriteServiceInterface>(AppComponent.FavoriteServiceInterface).to(FavoriteService).inSingletonScope();
  favoriteContainer.bind<Controller>(AppComponent.FavoriteController).to(FavoriteController).inSingletonScope();

  return favoriteContainer;
}
