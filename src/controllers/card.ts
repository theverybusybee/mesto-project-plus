import mongoose, { Error } from 'mongoose';
import { NextFunction, Request, Response } from 'express';
import Card from '../models/card';
import { statusCodes } from '../constants/responseStatusCodes';
import {
  BadRequestError,
  ForbiddenError,
  InternalServerError,
  NotFoundError,
} from 'errors';

export const getCards = (req: Request, res: Response, next: NextFunction) => {
  Card.find({})
    .then((cards) => {
      if (!cards) {
        throw new InternalServerError('На сервере произошла ошибка.');
      }
      res.status(statusCodes.Ok).send({ data: cards });
    })
    .catch(next);
};

export const createCard = (req: Request, res: Response, next: NextFunction) => {
  const { name, link } = req.body;

  const userId = req.user._id;

  return Card.create({ name, link, owner: userId })
    .then((card) => res.status(statusCodes.Created).send({ data: card }))
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
    .then(() =>
      res.status(statusCodes.Ok).send({ message: 'Карточка удалена' })
    )
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

  return Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true }
  )
    .populate(['owner', 'likes'])
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

  return Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: userId } },
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
        err = new BadRequestError('_id карточки невалидный');
      }
      next(customError);
    });
};
