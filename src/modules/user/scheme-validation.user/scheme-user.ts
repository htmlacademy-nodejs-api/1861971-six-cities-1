import Joi from 'joi';

import {Value} from '../../../core/constants/index.js';

const {
  Twelve,
  Six,
  One,
  Fifteen,
} = Value;

export const schemeUser = Joi.object({
  name: Joi.string()
    .min(One)
    .max(Fifteen)
    .required(),
  email: Joi.string()
    .email()
    .required(),
  avatarUser: Joi.string(),
  password: Joi.string()
    .min(Six)
    .max(Twelve)
    .required(),
  typeUser: Joi.string()
    .valid('ordinary', 'pro')
    .required()
});
