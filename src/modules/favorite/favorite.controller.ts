import {
  inject,
  injectable
} from 'inversify';
import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import {BaseController} from '../../libs/controller/index.js';
import {HttpMethod} from '../../libs/constants/index.js';
import {HttpError} from '../../libs/errors/index.js';
import { AppComponent } from '../../core/constants/index.js';
import { LoggerInterface } from '../../core/logger/index.js';
import {UserServiceInterface} from '../user/index.js';
import {
  OfferServiceInterface,
  OfferEntity
} from '../offer/index.js';
import OffersListRdo from '../offer/rdo/offers-list.rdo.js';
import { excludeExtraneousValues } from '../../helpers/index.js';
import {
  CreateFavoriteRequest,
  FavoriteServiceInterface,
} from './index.js';

@injectable()
export class FavoriteController extends BaseController {
  constructor(
    @inject(AppComponent.LoggerInterface) protected readonly logger: LoggerInterface,
    @inject(AppComponent.UserServiceInterface) private readonly userService: UserServiceInterface,
    @inject(AppComponent.FavoriteServiceInterface) private readonly favoriteService: FavoriteServiceInterface,
    @inject(AppComponent.OfferServiceInterface) private readonly offerService: OfferServiceInterface
  ) {
    super(logger);
    this.logger.info('Register routes for FavoriteController');

    this.addRoute({ path: '/create/:id', method: HttpMethod.Post, handler: this.create });
    this.addRoute({ path: '/delete/:id', method: HttpMethod.Delete, handler: this.delete });
    this.addRoute({ path: '/list', method: HttpMethod.Get, handler: this.getFavoriteOffersList });
  }

  public async create(
    { body, params: {id} }: CreateFavoriteRequest,
    res: Response,
  ): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.email);

    if (!existsUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email ${body.email} not registered.`,
        'FavoriteController'
      );
    }

    const existsFavoriteOffer = await this.favoriteService.findFavoriteOffer({offer: id as string, email: body.email});

    if (existsFavoriteOffer) {
      this.ok<string>(res, `Offer with ${id} has been added to favorites.`);
      return;
    }

    await this.favoriteService.create({offer: id as string, email: body.email});
    this.created<string>(res, `Offer with ${id} added to favorites.`);
  }

  public async delete(
    { body, params: {id} }: CreateFavoriteRequest,
    res: Response,
  ): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.email);

    if (!existsUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email ${body.email} not registered.`,
        'FavoriteController'
      );
    }

    const existsFavoriteOffer = await this.favoriteService.findFavoriteOffer({offer: id as string, email: body.email});

    if (!existsFavoriteOffer) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `You can't delete an offer with ${id} because you didn't create it.`,
        'FavoriteController'
      );
    }

    await this.favoriteService.deleteById(existsFavoriteOffer.id);
    this.ok<string>(res, `Offer with id ${existsFavoriteOffer.id} delete.`);
  }

  public async getFavoriteOffersList(
    { body }: CreateFavoriteRequest,
    res: Response,
  ): Promise<void> {
    const result: OfferEntity[] = [];
    const existsUser = await this.userService.findByEmail(body.email);

    if (!existsUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email ${body.email} not registered.`,
        'FavoriteController'
      );
    }

    const favoritOffersList = await this.favoriteService.getFavoriteOffersList(body.email);

    if(favoritOffersList?.length === 0) {
      this.ok(res, favoritOffersList);
      return;
    }


    favoritOffersList?.forEach(async (favoritOffer, _index, array) => {
      const offer = await this.offerService.findById(favoritOffer.offer);

      const changeOffer = {
        ...offer?.toObject(),
        favorites: true
      };

      result.push(changeOffer as OfferEntity);

      if(result.length - 1 === array.length - 1) {
        this.ok(res,excludeExtraneousValues(OffersListRdo, result));
      }
    });
  }
}
