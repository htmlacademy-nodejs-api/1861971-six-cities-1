import Joi from 'joi';

import {Value} from '../../../core/constants/index.js';

const {
  Ten,
  OneHundred,
  Twenty,
  OneThousandTwentyFour,
  Six,
  One,
  Eight,
  OneHundredThousand,
  Sewen,
  Fifteen,
} = Value;

export const schemeCreateOffer = Joi.object({
  denomination: Joi.string()
    .min(Ten)
    .max(OneHundred)
    .required(),
  descriptionOffer: Joi.string()
    .min(Twenty)
    .max(OneThousandTwentyFour)
    .required(),
  datePublication: Joi.string()
    .isoDate()
    .required(),
  city: Joi.string()
    .valid('Paris', 'Cologne', 'Brussels', 'Amsterdam', 'Hamburg', 'Dusseldorf')
    .required(),
  previewImage: Joi.string()
    .required(),
  photosHousing: Joi.array()
    .length(Six)
    .required(),
  premium: Joi.boolean()
    .required(),
  favorites: Joi.boolean()
    .required(),
  typeHousing: Joi.string()
    .valid('apartment', 'house', 'room', 'hotel')
    .required(),
  numberRooms: Joi.number()
    .min(One)
    .max(Eight)
    .required(),
  numberGuests: Joi.number()
    .min(One)
    .max(Ten)
    .required(),
  rentPrice: Joi.number()
    .min(OneHundred)
    .max(OneHundredThousand)
    .required(),
  comforts: Joi.array()
    .items(
      Joi.string().valid('Breakfast', 'Air conditioning', 'Laptop friendly workspace', 'Baby seat', 'Washer', 'Towels', 'Fridge')
    )
    .min(One)
    .max(Sewen)
    .required(),
  authorOfOffer: Joi.object({
    name: Joi.string()
      .min(One)
      .max(Fifteen)
      .required(),
    email: Joi.string()
      .email()
      .required(),
    avatarUser: Joi.string(),
    typeUser: Joi.string()
      .valid('ordinary', 'pro')
      .required()
  })
    .required(),
  coordinates: Joi.object({
    latitude: Joi.number()
      .unsafe()
      .required(),
    longitude: Joi.number()
      .unsafe()
      .required()
  })
});
