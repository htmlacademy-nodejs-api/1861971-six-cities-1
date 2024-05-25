import { StatusCodes } from 'http-status-codes';

import {HttpError} from '../libs/errors/index.js';
import {NameActions} from '../core/constants/index.js';

type Message = {
    nameError: string;
    nameController: string;
  };

const getErrorMessage = (value: string, indicator: string) => {
  const FAVORITE_CONTROLLER = 'FavoriteController';
  const OFFER_CONTROLLER = 'OfferController';
  const USER_CONTROLLER = 'UserController';

  let message = {};

  switch(indicator) {
    case NameActions.CreatUser:
      message = {
        nameError: `User with email ${value} exists.`,
        nameController: USER_CONTROLLER
      };
      break;
    case NameActions.CheckRegistrationUser:
      message = {
        nameError: `User with email ${value} not registered.`,
        nameController: OFFER_CONTROLLER
      };
      break;
    case NameActions.UpdateOffer:
      message = {
        nameError: `User with email ${value} cannote edit this offer.`,
        nameController: OFFER_CONTROLLER
      };
      break;
    case NameActions.DeleteOffer:
      message = {
        nameError: `User with email ${value} cannote delete this offer.`,
        nameController: OFFER_CONTROLLER
      };
      break;
    case NameActions.DeleteFavorite:
      message = {
        nameError: `You can't delete an offer with ${value} because you didn't create it.`,
        nameController: FAVORITE_CONTROLLER
      };
      break;
  }

  return message;
};

export const getErrorConflict = (value: string, indicator: string) => {
  const errorMessage = getErrorMessage(value, indicator);
  const {nameError, nameController} = errorMessage as Message;

  throw new HttpError(
    StatusCodes.CONFLICT,
    nameError,
    nameController
  );
};
