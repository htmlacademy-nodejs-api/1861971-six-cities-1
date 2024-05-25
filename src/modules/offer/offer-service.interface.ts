import {DocumentType} from '@typegoose/typegoose';

import {OfferEntity} from './index.js';
import CreateOfferDto from './dto/create-offer.dto.js';
import UpdateOfferDto from './dto/update-offer.dto.js';
import {CitiesList} from '../../core/types/index.js';

export interface OfferServiceInterface {
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null>;
  deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  getOffersList(count?: string): Promise<DocumentType<OfferEntity>[] | []>;
  findById(offerId: string | undefined): Promise<DocumentType<OfferEntity> | null>;
  findPremiumOffers(nameCity: CitiesList): Promise<DocumentType<OfferEntity>[] | null>;
}
