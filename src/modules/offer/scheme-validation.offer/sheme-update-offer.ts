import Joi from 'joi';

import {Value} from '../../../core/constants/index.js';

const {
  OneHundred,
  Twenty,
  OneThousandTwentyFour,
  Six,
  One,
  Eight,
  OneHundredThousand,
  Fifteen,
} = Value;

export const schemeUpdateOffer = Joi.object({
  denomination: Joi.string()
    .min(Twenty)
    .max(OneHundred),
  descriptionOffer: Joi.string()
    .min(Twenty)
    .max(OneThousandTwentyFour),
  datePublication: Joi.string()
    .isoDate(),
  city: Joi.string()
    .valid('Paris', 'Cologne', 'Brussels', 'Amsterdam', 'Hamburg', 'Dusseldorf'),
  previewImage: Joi.string(),
  photosHousing: Joi.array()
    .length(Six),
  premium: Joi.boolean(),
  favorites: Joi.boolean(),
  typeHousing: Joi.string()
    .valid('apartment', 'house', 'room', 'hotel'),
  numberRooms: Joi.number()
    .min(One)
    .max(Eight),
  numberGuests: Joi.number()
    .min(One)
    .max(Twenty),
  rentPrice: Joi.number()
    .min(OneHundred)
    .max(OneHundredThousand),
  comforts: Joi.array()
    .items(
      Joi.string().valid('Breakfast', 'Air conditioning', 'Laptop friendly workspace', 'Baby seat', 'Washer', 'Towels', 'Fridge')
    )
    .min(One)
    .max(Six),
  authorOfOffer: Joi.object({
    name: Joi.string()
      .min(One)
      .max(Fifteen),
    email: Joi.string()
      .email(),
    avatarUser: Joi.string(),
    typeUser: Joi.string()
      .valid('ordinary', 'pro')
  }),
  coordinates: Joi.object({
    latitude: Joi.number()
      .unsafe(),
    longitude: Joi.number()
      .unsafe()
  })
});
