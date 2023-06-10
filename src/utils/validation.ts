import { celebrate, Joi } from 'celebrate';
import { BadRequestError } from './errors';
const validator = require('validator');

const urlValidator = (url: string) => {
  if (validator.isUrl()(url, { require_protocol: true })) {
    throw new BadRequestError('Введена невалидная ссылка');
  }
  return url;
};

const emailValidator = (email: string) => {
  if (!validator.isEmail(email)) {
    throw new BadRequestError('Введен невалидный email');
  }
  return email;
};

export const avatarValidator = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().custom(urlValidator),
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
    avatar: Joi.string().custom(urlValidator),
  }),
});

export const signUpValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(urlValidator),
    email: Joi.string().custom(emailValidator),
    password: Joi.string().required(),
  }),
});

export const createCardValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().custom(urlValidator),
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
