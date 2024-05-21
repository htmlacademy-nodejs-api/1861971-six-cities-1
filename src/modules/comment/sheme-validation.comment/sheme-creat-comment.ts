import Joi from 'joi';

export const shemeCreatComment = Joi.object({
  text: Joi.string()
    .min(5)
    .max(1024)
    .required(),
  datePublication: Joi.string()
    .isoDate()
    .required(),
  rating: Joi.number()
    .min(1)
    .max(5),
  authorOfOffer: Joi.string()
    .required()
});
