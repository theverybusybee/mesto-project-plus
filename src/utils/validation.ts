import { celebrate, Joi } from 'celebrate';
import { BadRequestError } from './errors';
const validator = require('validator');

const emailValidator = (email: string) => {
  if (!validator.isEmail(email)) {
    throw new BadRequestError('Введен невалидный email');
  }
  return email;
};

const checkIsUrlValid = Joi.string()
  .regex(/https?:\/\/(www\.)?([-\w.:])+([-\w._~:/?#[\]@!$&'()*+,;=])*/i)
  .required()
  .label('URL');

export const avatarValidator = celebrate({
  body: Joi.object().keys({
    avatar: checkIsUrlValid,
  }),
});

export const userDataValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(200),
  }),
});

export const signInValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    avatar: checkIsUrlValid,
  }),
});

export const signUpValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: checkIsUrlValid,
    email: Joi.string().custom(emailValidator),
    password: Joi.string().required(),
  }),
});

export const createCardValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: checkIsUrlValid,
  }),
});

export const cardIdValidator = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
});

export const userIdValidator = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
});
