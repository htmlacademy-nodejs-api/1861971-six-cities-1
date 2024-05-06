import {DocumentType} from '@typegoose/typegoose';

import {OfferEntity} from './index.js';
import CreateOfferDto from './dto/create-offer.dto.js';
import UpdateOfferDto from './dto/update-offer.dto.js';

export interface OfferServiceInterface {
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null>;
  deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  getOffersList(count?: number): Promise<DocumentType<OfferEntity>[] | null>;
  findById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  findPremiumOffers(): Promise<DocumentType<OfferEntity>[] | null>;
  findFavoritesOffers(): Promise<DocumentType<OfferEntity>[] | null>;
}
