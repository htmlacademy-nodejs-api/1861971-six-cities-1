import Joi from 'joi';

import {Value} from '../../../core/constants/index.js';

const {Five, OneThousandTwentyFour, One} = Value;

export const shemeCreatComment = Joi.object({
  comment: Joi.string()
    .min(Five)
    .max(OneThousandTwentyFour)
    .required(),
  rating: Joi.number()
    .min(One)
    .max(Five)
});
