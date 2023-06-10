import { NextFunction, Request, Response } from 'express';
import { Error } from 'mongoose';
import Card from '../models/card';
import { HttpStatus } from '../utils/constants/responseStatusCodes';
import {
  BadRequestError,
  ForbiddenError,
  InternalServerError,
  NotFoundError,
} from '../utils/errors';

export const getCards = (req: Request, res: Response, next: NextFunction) => {
  Card.find({})
    .then((cards) => {
      if (!cards) {
        throw new InternalServerError('На сервере произошла ошибка.');
      }
      res.status(HttpStatus.Ok).send({ data: cards });
    })
    .catch(next);
};

export const createCard = (req: Request, res: Response, next: NextFunction) => {
  const { name, link } = req.body;

  const userId = req.user._id;

  return Card.create({ name, link, owner: userId })
    .then((card) => res.status(HttpStatus.Created).send({ data: card }))
    .catch((err) => {
      let customError = err;
      if (err.name === 'ValidationError') {
        customError = new BadRequestError(err.message);
      }
      next(customError);
    });
};

export const deleteCard = (req: Request, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  return Card.findOne({ _id: cardId })
    .then((card) => {
      const ownerId = String(card?.owner);
      if (userId !== ownerId) {
        throw new ForbiddenError('Доступ к карточке запрещен');
      }
      return Card.deleteOne({ _id: card?._id });
    })
    .then(() => res.status(HttpStatus.Ok).send({ message: 'Карточка удалена' }))
    .catch((err) => {
      let customError = err;
      if (err instanceof Error.CastError) {
        customError = new BadRequestError('_id карточки невалидный');
      }
      next(customError);
    });
};

export const setLike = (req: Request, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError(`Нет карточки с id: ${cardId}`);
      }
      res.send({ data: card });
    })
    .catch((err) => {
      let customError = err;
      if (err instanceof Error.CastError) {
        customError = new BadRequestError('_id карточки невалидный');
      }
      next(customError);
    });
};

export const removeLike = (req: Request, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError(`Нет карточки с id: ${cardId}`);
      }
      res.send({ data: card });
    })
    .catch((err) => {
      let customError = err;
      if (err instanceof Error.CastError) {
        customError = new BadRequestError('_id карточки невалидный');
      }
      next(customError);
    });
};
