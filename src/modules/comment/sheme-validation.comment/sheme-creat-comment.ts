import Joi from 'joi';

import {Value} from '../../../core/constants/index.js';

const {Five, OneThousandTwentyFour, One} = Value;

export const shemeCreatComment = Joi.object({
  text: Joi.string()
    .min(Five)
    .max(OneThousandTwentyFour)
    .required(),
  datePublication: Joi.string()
    .isoDate()
    .required(),
  rating: Joi.number()
    .min(One)
    .max(Five),
  authorOfOffer: Joi.string()
    .required()
});
