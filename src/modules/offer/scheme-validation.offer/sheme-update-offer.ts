import Joi from 'joi';

export const schemeUpdateOffer = Joi.object({
  denomination: Joi.string()
    .min(10)
    .max(100),
  descriptionOffer: Joi.string()
    .min(20)
    .max(1024),
  datePublication: Joi.string()
    .isoDate(),
  city: Joi.string()
    .valid('Paris', 'Cologne', 'Brussels', 'Amsterdam', 'Hamburg', 'Dusseldorf'),
  previewImage: Joi.string(),
  photosHousing: Joi.array()
    .length(6),
  premium: Joi.boolean(),
  favorites: Joi.boolean(),
  typeHousing: Joi.string()
    .valid('apartment', 'house', 'room', 'hotel'),
  numberRooms: Joi.number()
    .min(1)
    .max(8),
  numberGuests: Joi.number()
    .min(1)
    .max(10),
  rentPrice: Joi.number()
    .min(100)
    .max(100000),
  comforts: Joi.array()
    .items(
      Joi.string().valid('Breakfast', 'Air conditioning', 'Laptop friendly workspace', 'Baby seat', 'Washer', 'Towels', 'Fridge')
    )
    .min(1)
    .max(7),
  authorOfOffer: Joi.object({
    name: Joi.string()
      .min(1)
      .max(15),
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
