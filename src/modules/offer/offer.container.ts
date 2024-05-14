import { Container } from 'inversify';
import {types} from '@typegoose/typegoose';

import { AppComponent } from '../../core/constants/index.js';
import OfferService from './offer.service.js';
import {
  OfferEntity,
  OfferModel,
  OfferServiceInterface,
  OfferController
} from './index.js';
import {Controller} from '../../libs/controller/index.js';

export function createOfferContainer() {
  const offerContainer = new Container();

  offerContainer.bind<OfferServiceInterface>(AppComponent.OfferServiceInterface).to(OfferService).inSingletonScope();
  offerContainer.bind<types.ModelType<OfferEntity>>(AppComponent.OfferModel).toConstantValue(OfferModel);
  offerContainer.bind<Controller>(AppComponent.OfferController).to(OfferController).inSingletonScope();

  return offerContainer;
}
