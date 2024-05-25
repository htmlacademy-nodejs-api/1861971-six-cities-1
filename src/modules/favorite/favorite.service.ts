import {
  types,
  DocumentType
} from '@typegoose/typegoose';
import {
  inject,
  injectable
} from 'inversify';

import {
  FavoriteServiceInterface,
  FavoriteEntity,
} from './index.js';
import CreateFavoriteDto from './dto/create-favorite.dto.js';
import {
  AppComponent,
  SortType
} from '../../core/constants/index.js';
import { LoggerInterface } from '../../core/logger/index.js';

@injectable()
export default class FavoriteService implements FavoriteServiceInterface {
  constructor(
    @inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(AppComponent.FavoriteModel) private readonly favoriteModel: types.ModelType<FavoriteEntity>
  ) {}

  public async findFavoriteOffer({offer, email}: CreateFavoriteDto): Promise<DocumentType<FavoriteEntity> | null> {
    return this.favoriteModel
      .findOne({offer, email});
  }

  public async create(dto: CreateFavoriteDto): Promise<DocumentType<FavoriteEntity>> {
    const result = await this.favoriteModel.create(dto);
    this.logger.info(`New favorit offer created: ${result.id}`);

    return result;
  }

  public async deleteById(idOffer: string): Promise<DocumentType<FavoriteEntity> | null> {
    return this.favoriteModel
      .findByIdAndDelete(idOffer)
      .exec();
  }

  public async getFavoriteOffersList(email: string): Promise<DocumentType<FavoriteEntity>[] | []> {
    return this.favoriteModel
      .find({email})
      .sort({createdAt: SortType.Down})
      .exec();
  }
}
