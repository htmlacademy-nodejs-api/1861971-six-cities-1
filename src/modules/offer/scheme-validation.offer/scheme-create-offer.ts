import Joi from 'joi';

export const schemeCreateOffer = Joi.object({
  denomination: Joi.string()
    .min(10)
    .max(100)
    .required(),
  descriptionOffer: Joi.string()
    .min(20)
    .max(1024)
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
    .length(6)
    .required(),
  premium: Joi.boolean()
    .required(),
  favorites: Joi.boolean()
    .required(),
  typeHousing: Joi.string()
    .valid('apartment', 'house', 'room', 'hotel')
    .required(),
  numberRooms: Joi.number()
    .min(1)
    .max(8)
    .required(),
  numberGuests: Joi.number()
    .min(1)
    .max(10)
    .required(),
  rentPrice: Joi.number()
    .min(100)
    .max(100000)
    .required(),
  comforts: Joi.array()
    .items(
      Joi.string().valid('Breakfast', 'Air conditioning', 'Laptop friendly workspace', 'Baby seat', 'Washer', 'Towels', 'Fridge')
    )
    .min(1)
    .max(7)
    .required(),
  authorOfOffer: Joi.object({
    name: Joi.string()
      .min(1)
      .max(15)
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
