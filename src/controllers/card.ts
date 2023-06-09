import mongoose, { Error } from 'mongoose';
import { Request, Response } from 'express';
import Card from '../models/card';
import {
  BAD_REQUEST,
  CREATED,
  FORBIDDEN,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  OK,
} from '../constants/responseStatusCodes';

export const getCards = (req: Request, res: Response) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() =>
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: `Внутренняя ошибка сервера` })
    );
};

export const createCard = (req: Request, res: Response) => {
  const { name, link } = req.body;

  const userId = req.user._id;

  return Card.create({ name, link, owner: userId })
    .then((card) => res.status(CREATED).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: `${err.message}` });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR)
          .send({ message: 'Внутренняя ошибка сервера' });
      }
    });
};

export const deleteCard = (req: Request, res: Response) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  return Card.findOne({ _id: cardId })
    .then((card) => {
      const ownerId = String(card?.owner);
      if (userId !== ownerId) {
        res.status(FORBIDDEN).send({ message: `Доступ к карточке запрещен` });
        return;
      }
      return Card.deleteOne({ _id: card?._id });
    })
    .then(() => res.status(OK).send({ message: 'Карточка удалена' }))
    .catch((err) => {
      if (err instanceof Error.CastError) {
        return res
          .status(BAD_REQUEST)
          .send({ message: `_id карточки невалидный` });
      }
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: `Внутренняя ошибка сервера` });
    });
  // return Card.findByIdAndDelete({ _id: cardId }).then((card) => {
  //   if (card) {
  //     res.send({ data: card });
  //   } else {
  //     res
  //       .status(NOT_FOUND)
  //       .send({ message: `Карточка с _id: ${cardId} не существует` });
  //   }
  // });
};

export const setLike = (req: Request, res: Response) => {
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
        res.status(NOT_FOUND).send({ message: `Нет карточки с id: ${cardId}` });
        return;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err instanceof Error.CastError) {
        return res
          .status(BAD_REQUEST)
          .send({ message: `_id карточки невалидный` });
      }
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: `Внутренняя ошибка сервера` });
    });
};

export const removeLike = (req: Request, res: Response) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  return Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: userId } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND).send({ message: `Нет карточки с id: ${cardId}` });
        return;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err instanceof Error.CastError) {
        return res
          .status(BAD_REQUEST)
          .send({ message: `_id карточки невалидный` });
      }
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: `Внутренняя ошибка сервера` });
    });
};
