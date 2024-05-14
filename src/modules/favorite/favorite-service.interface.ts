import { DocumentType } from '@typegoose/typegoose';

import {FavoriteEntity} from './index.js';
import CreateFavoriteDto from './dto/create-favorite.dto.js';

export interface FavoriteServiceInterface {
  findFavoriteOffer(dto: CreateFavoriteDto): Promise<DocumentType<FavoriteEntity> | null>
  create(dto: CreateFavoriteDto): Promise<DocumentType<FavoriteEntity>>;
  deleteById(idOffer: string): Promise<DocumentType<FavoriteEntity> | null>;
  getFavoriteOffersList(email: string): Promise<DocumentType<FavoriteEntity>[] | null>
}
