import Joi from 'joi';

export const schemeUser = Joi.object({
  name: Joi.string()
    .min(1)
    .max(15)
    .required(),
  email: Joi.string()
    .email()
    .required(),
  avatarUser: Joi.string(),
  password: Joi.string()
    .min(6)
    .max(12)
    .required(),
  typeUser: Joi.string()
    .valid('ordinary', 'pro')
    .required()
});
