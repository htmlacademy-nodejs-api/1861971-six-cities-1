import Joi from 'joi';

import {Value} from '../../../core/constants/index.js';

const {
  Twelve,
  Six
} = Value;

export const schemeLoginUser = Joi.object({
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string()
    .min(Six)
    .max(Twelve)
    .required()
});
