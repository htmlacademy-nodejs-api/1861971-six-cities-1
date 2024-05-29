import {
  inject,
  injectable
} from 'inversify';
import {
  Request,
  Response
} from 'express';

import {BaseController} from '../../libs/controller/index.js';
import {HttpMethod} from '../../libs/constants/index.js';
import {
  AppComponent,
  NameActions
} from '../../core/constants/index.js';
import { LoggerInterface } from '../../core/logger/index.js';
import {UserServiceInterface} from '../user/index.js';
import {
  OfferServiceInterface,
  OfferEntity,
  ParamOfferId
} from '../offer/index.js';
import OffersListRdo from '../offer/rdo/offers-list.rdo.js';
import {
  excludeExtraneousValues,
  getErrorConflict
} from '../../helpers/index.js';
import {
  CreateFavoriteRequest,
  FavoriteServiceInterface,
} from './index.js';
import {
  ValidateObjectIdMiddleware,
  PrivateRouteMiddleware,
  ParseTokenMiddleware
} from '../../libs/middleware/index.js';
import CreateFavoriteDto from '../favorite/dto/create-favorite.dto.js';
import {ConfigInterface} from '../../core/config/index.js';
import {RestSchema} from '../../core/types/index.js';

@injectable()
export class FavoriteController extends BaseController {
  constructor(
    @inject(AppComponent.LoggerInterface) protected readonly logger: LoggerInterface,
    @inject(AppComponent.UserServiceInterface) private readonly userService: UserServiceInterface,
    @inject(AppComponent.FavoriteServiceInterface) private readonly favoriteService: FavoriteServiceInterface,
    @inject(AppComponent.OfferServiceInterface) private readonly offerService: OfferServiceInterface,
    @inject(AppComponent.ConfigInterface) private readonly configService: ConfigInterface<RestSchema>
  ) {
    super(logger);
    this.logger.info('Register routes for FavoriteController');
    const authenticateMiddleware = new ParseTokenMiddleware(this.configService.get('JWT_ACCESS_SECRET'));
    const privateRoute = new PrivateRouteMiddleware();

    this.addRoute({
      path: '/create/:offerId',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        authenticateMiddleware,
        privateRoute,
        new ValidateObjectIdMiddleware('offerId')
      ]
    });
    this.addRoute({
      path: '/delete/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        authenticateMiddleware,
        privateRoute,
        new ValidateObjectIdMiddleware('offerId')
      ]
    });
    this.addRoute({
      path: '/list',
      method: HttpMethod.Get,
      handler: this.getFavoriteOffersList,
      middlewares: [
        authenticateMiddleware,
        privateRoute
      ]
    });
  }

  public async create(
    { params: {offerId}, tokenPayload:{email} }: Request<ParamOfferId, unknown, CreateFavoriteDto>,
    res: Response,
  ): Promise<void> {
    const existsUser = await this.userService.findByEmail(email);

    if (!existsUser) {
      getErrorConflict(email, NameActions.CheckRegistrationUser);
    }

    const existsFavoriteOffer = await this.favoriteService.findFavoriteOffer({offer: offerId, email});

    if (existsFavoriteOffer) {
      this.ok<string>(res, `Offer with ${offerId} has been added to favorites.`);
      return;
    }

    await this.favoriteService.create({offer: offerId, email});
    this.created<string>(res, `Offer with ${offerId} added to favorites.`);
  }

  public async delete(
    { params: {offerId}, tokenPayload:{email} }: Request<ParamOfferId, unknown, CreateFavoriteDto>,
    res: Response,
  ): Promise<void> {
    const existsUser = await this.userService.findByEmail(email);

    if (!existsUser) {
      getErrorConflict(email, NameActions.CheckRegistrationUser);
    }

    const existsFavoriteOffer = await this.favoriteService.findFavoriteOffer({offer: offerId, email});

    if (!existsFavoriteOffer) {
      getErrorConflict(offerId, NameActions.DeleteFavorite);
      return;
    }

    await this.favoriteService.deleteById(existsFavoriteOffer.id);
    this.ok<string>(res, `Offer with id ${existsFavoriteOffer.id} delete.`);
  }

  public async getFavoriteOffersList(
    { tokenPayload:{email} }: CreateFavoriteRequest,
    res: Response,
  ): Promise<void> {
    const result: OfferEntity[] = [];
    const existsUser = await this.userService.findByEmail(email);

    if (!existsUser) {
      getErrorConflict(email, NameActions.CheckRegistrationUser);
    }

    const favoritOffersList = await this.favoriteService.getFavoriteOffersList(email);

    if(favoritOffersList?.length === 0) {
      this.ok(res, favoritOffersList);
      return;
    }


    for await (const favoritOffer of favoritOffersList) {
      const offer = await this.offerService.findById(favoritOffer.offer);

      const changeOffer = {
        ...offer?.toObject(),
        favorites: true
      };

      result.push(changeOffer as OfferEntity);
    }

    this.ok(res,excludeExtraneousValues(OffersListRdo, result));
  }
}
