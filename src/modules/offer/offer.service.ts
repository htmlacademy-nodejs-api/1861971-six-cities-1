import {
  inject,
  injectable
} from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';

import {
  AppComponent,
  SortType,
  DefaultValues
} from '../../core/constants/index.js';
import { LoggerInterface } from '../../core/logger/index.js';
import CreateOfferDto from './dto/create-offer.dto.js';
import UpdateOfferDto from './dto/update-offer.dto.js';
import {
  OfferEntity,
  OfferServiceInterface
} from './index.js';
import {CitiesList} from '../../core/types/index.js';

@injectable()
export default class OfferService implements OfferServiceInterface {
  constructor(
    @inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(AppComponent.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>
  ) {}

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`New offer created: ${dto.denomination}`);

    return result;
  }

  public async updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, dto, {new: true})
      .populate('authorOfOffer')
      .exec();
  }

  public async deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndDelete(offerId)
      .exec();
  }

  public async getOffersList(count?: string | undefined): Promise<DocumentType<OfferEntity>[] | null> {
    const limit = count ?? DefaultValues.OfferCount;

    return this.offerModel
      .find()
      .sort({datePublication: SortType.Down})
      .limit(Number(limit))
      .exec();
  }

  public async findById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findById(offerId)
      /*
      .aggregate([
        {
          $lookup: {
            from: 'comments',
            pipeline: [
              { $match: { $expr: { $in: [offerId, '$offerId'] } } },
              { $project: { rating: 1}}
            ],
            as: 'comments'
          },
        },
        {numberOfComments: { $size: '$comments'}},
        {rating: { $cond: { $isArray: '$rating' }, then: { $size: '$rating' }}},
        { $unset: ['comments'] }
      ])
      */
      .exec();
  }

  public async findPremiumOffers(nameCity: CitiesList): Promise<DocumentType<OfferEntity>[] | null> {

    return this.offerModel
      .find({city: nameCity, premium: true})
      .sort({datePublication: SortType.Down})
      .limit(DefaultValues.PremiumOfferCount)
      .exec();
  }

  public async findFavoritesOffers(): Promise<DocumentType<OfferEntity>[] | null> {

    return this.offerModel
      .find({favorites: true})
      .exec();
  }
}
