import {
  inject,
  injectable
} from 'inversify';
import {
  Response,
  Request
} from 'express';

import {BaseController} from '../../libs/controller/index.js';
import {HttpMethod} from '../../libs/constants/index.js';
import {
  AppComponent,
  NameActions
} from '../../core/constants/index.js';
import { LoggerInterface } from '../../core/logger/index.js';
import UserService from '../user/user.service.js';
import {
  OfferServiceInterface,
  CreateOfferRequest,
  ParamOfferId,
  OfferEntity,
  schemeCreateOffer,
  schemeUpdateOffer
} from './index.js';
import {
  excludeExtraneousValues,
  getErrorConflict
} from '../../helpers/index.js';
import CreateOfferDto from './dto/create-offer.dto.js';
import OfferRdo from './rdo/offer.rdo.js';
import OffersListRdo from './rdo/offers-list.rdo.js';
import {CitiesList} from '../../core/types/index.js';
import {CommentServiceInterface} from '../comment/index.js';
import FavoriteService from '../favorite/favorite.service.js';
import {
  ValidateObjectIdMiddleware,
  ValidateDtoMiddleware,
  PrivateRouteMiddleware,
  ParseTokenMiddleware
} from '../../libs/middleware/index.js';
import {ConfigInterface} from '../../core/config/index.js';
import {RestSchema} from '../../core/types/index.js';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(AppComponent.LoggerInterface) protected readonly logger: LoggerInterface,
    @inject(AppComponent.UserServiceInterface) private readonly userService: UserService,
    @inject(AppComponent.OfferServiceInterface) private readonly offerService: OfferServiceInterface,
    @inject(AppComponent.CommentServiceInterface) private readonly commentService: CommentServiceInterface,
    @inject(AppComponent.FavoriteServiceInterface) private readonly favoriteService: FavoriteService,
    @inject(AppComponent.ConfigInterface) private readonly configService: ConfigInterface<RestSchema>
  ) {
    super(logger);
    this.logger.info('Register routes for OfferController');
    const authenticateMiddleware = new ParseTokenMiddleware(this.configService.get('JWT_ACCESS_SECRET'));
    const privateRoute = new PrivateRouteMiddleware();

    this.addRoute({
      path: '/create',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        authenticateMiddleware,
        privateRoute,
        new ValidateDtoMiddleware(schemeCreateOffer)
      ]
    });
    this.addRoute({
      path: '/redaction/:offerId',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        authenticateMiddleware,
        privateRoute,
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(schemeUpdateOffer)
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
    this.addRoute({ path: '/list', method: HttpMethod.Get, handler: this.index });
    this.addRoute({
      path: '/offer/:offerId',
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [new ValidateObjectIdMiddleware('offerId')]
    });
    this.addRoute({ path: '/premium/:nameCity', method: HttpMethod.Get, handler: this.getPremiumList });
  }

  public async create(
    { body, tokenPayload: {email} }: CreateOfferRequest,
    res: Response,
  ): Promise<void> {
    const registrationUser = await this.userService.findByEmail(email);

    if (!registrationUser) {
      getErrorConflict(email, NameActions.CheckRegistrationUser);
    }

    const result = await this.offerService.create(body);
    this.created(res, excludeExtraneousValues(OfferRdo, result));
  }

  public async update(
    { body, params:{offerId}, tokenPayload:{email} }: Request<ParamOfferId, unknown, CreateOfferDto>,
    res: Response,
  ): Promise<void> {
    const registrationUser = await this.userService.findByEmail(email);

    if (!registrationUser) {
      getErrorConflict(email, NameActions.CheckRegistrationUser);
    }

    const dataOffer = await this.offerService.findById(offerId);

    if(dataOffer?.authorOfOffer.email !== email) {
      getErrorConflict(email, NameActions.UpdateOffer);
    }

    const result = await this.offerService.updateById(offerId, body);
    this.created(res, excludeExtraneousValues(OfferRdo, result));
  }

  public async delete(
    { params:{offerId}, tokenPayload:{email} }: Request<ParamOfferId, unknown, CreateOfferDto>,
    res: Response,
  ): Promise<void> {
    const registrationUser = await this.userService.findByEmail(email);

    if (!registrationUser) {
      getErrorConflict(email, NameActions.CheckRegistrationUser);
    }

    const dataOffer = await this.offerService.findById(offerId);

    if(dataOffer?.authorOfOffer.email !== email) {
      getErrorConflict(email, NameActions.DeleteOffer);
    }

    await this.commentService.deleteById(offerId);
    const result = await this.offerService.deleteById(offerId);
    this.ok<string>(res, `Offer with id ${result?.id}, deleted successfully`);
  }

  public async index(
    { query: {count} }: CreateOfferRequest,
    res: Response,
  ): Promise<void> {
    const offersList = await this.offerService.getOffersList(count as string | undefined);
    const result: OfferEntity[] = [];
    for await (const offer of offersList) {

      const dataFavorit = await this.favoriteService
        .findFavoriteOffer(
          {
            offer: offer.id,
            email: offer.authorOfOffer.email
          }
        );

      if(dataFavorit) {
        result.push({
          ...offer?.toObject(),
          favorites: true
        });
      }else{
        result.push(offer);
      }
    }

    this.ok(res, excludeExtraneousValues(OffersListRdo, result));
  }

  public async show (
    { params:{offerId} }: Request<ParamOfferId>,
    res: Response,
  ): Promise<void> {
    const dataOffer = await this.offerService.findById(offerId);

    if(!dataOffer) {
      this.ok(res, `Offer with id ${offerId}, does not exist`);
      return;
    }

    const dataCommentslist = await this.commentService.findByOfferId(offerId);

    let rating = 0;
    dataCommentslist.forEach((comment) => {
      rating += comment.rating;
    });

    const newOffer = await this.offerService.updateById(
      offerId,
      {
        rating,
        numberOfComments: dataCommentslist.length
      }
    );

    const dataFavorit = await this.favoriteService
      .findFavoriteOffer(
        {
          offer: offerId,
          email: dataOffer?.authorOfOffer.email
        }
      );

    if(dataFavorit) {
      const result = {
        ...newOffer?.toObject(),
        favorites: true
      };
      this.ok(res, excludeExtraneousValues(OfferRdo, result));
      return;
    }

    this.ok(res, excludeExtraneousValues(OfferRdo, newOffer));
  }

  public async getPremiumList(
    { params:{nameCity} }: CreateOfferRequest,
    res: Response,
  ): Promise<void> {
    const result = await this.offerService.findPremiumOffers(nameCity as CitiesList);
    this.ok(res, excludeExtraneousValues(OfferRdo, result));
  }
}
