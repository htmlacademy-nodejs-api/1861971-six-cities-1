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
import UserService from '../user/user.service.js';
import {
  OfferServiceInterface,
  CreateOfferRequest
} from './index.js';
import { excludeExtraneousValues } from '../../helpers/index.js';
import OfferRdo from './rdo/offer.rdo.js';
import OffersListRdo from './rdo/offers-list.rdo.js';
import {CitiesList} from '../../core/types/index.js';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(AppComponent.LoggerInterface) protected readonly logger: LoggerInterface,
    @inject(AppComponent.UserServiceInterface) private readonly userService: UserService,
    @inject(AppComponent.OfferServiceInterface) private readonly offerService: OfferServiceInterface
  ) {
    super(logger);
    this.logger.info('Register routes for OfferController');

    this.addRoute({ path: '/create', method: HttpMethod.Post, handler: this.create });
    this.addRoute({ path: '/redaction/:id', method: HttpMethod.Patch, handler: this.redaction });
    this.addRoute({ path: '/delete/:id', method: HttpMethod.Delete, handler: this.delete });
    this.addRoute({ path: '/list', method: HttpMethod.Get, handler: this.getList });
    this.addRoute({ path: '/offer/:id', method: HttpMethod.Get, handler: this.detailed });
    this.addRoute({ path: '/premium/:nameCity', method: HttpMethod.Get, handler: this.getPremiumList });
  }

  public async create(
    { body }: CreateOfferRequest,
    res: Response,
  ): Promise<void> {
    const registrationUser = await this.userService.findByEmail(body.authorOfOffer.email);

    if (!registrationUser) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        `User with email ${body.authorOfOffer.email} not registered.`,
        'OfferController'
      );
    }

    const result = await this.offerService.create(body);
    this.created(res, excludeExtraneousValues(OfferRdo, result));
  }

  public async redaction(
    { body, params:{id} }: CreateOfferRequest,
    res: Response,
  ): Promise<void> {
    const registrationUser = await this.userService.findByEmail(body.authorOfOffer.email);

    if (!registrationUser) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        `User with email ${body.authorOfOffer.email} not registered.`,
        'OfferController'
      );
    }

    const dataOffer = await this.offerService.findById(id as string);

    if(dataOffer?.authorOfOffer.email !== body.authorOfOffer.email) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email ${body.authorOfOffer.email} cannote edit this offer.`,
        'OfferController'
      );
    }

    const result = await this.offerService.updateById(id as string, body);
    this.created(res, excludeExtraneousValues(OfferRdo, result));
  }

  public async delete(
    { body, params:{id} }: CreateOfferRequest,
    res: Response,
  ): Promise<void> {
    const registrationUser = await this.userService.findByEmail(body.authorOfOffer.email);

    if (!registrationUser) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        `User with email ${body.authorOfOffer.email} not registered.`,
        'OfferController'
      );
    }

    const dataOffer = await this.offerService.findById(id as string);

    if(dataOffer?.authorOfOffer.email !== body.authorOfOffer.email) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email ${body.authorOfOffer.email} cannote delete this offer.`,
        'OfferController'
      );
    }

    const result = await this.offerService.deleteById(id as string);
    this.ok<string>(res, `Offer with id ${result?.id}, deleted successfully`);
  }

  public async getList(
    { query: {count} }: CreateOfferRequest,
    res: Response,
  ): Promise<void> {
    const result = await this.offerService.getOffersList(count as string | undefined);
    this.ok(res, excludeExtraneousValues(OffersListRdo, result));
  }

  public async detailed(
    { params:{id} }: CreateOfferRequest,
    res: Response,
  ): Promise<void> {
    const result = await this.offerService.findById(id as string);
    this.ok(res, excludeExtraneousValues(OfferRdo, result));
  }

  public async getPremiumList(
    { params:{nameCity} }: CreateOfferRequest,
    res: Response,
  ): Promise<void> {
    const result = await this.offerService.findPremiumOffers(nameCity as CitiesList);
    this.ok(res, excludeExtraneousValues(OfferRdo, result));
  }
}
