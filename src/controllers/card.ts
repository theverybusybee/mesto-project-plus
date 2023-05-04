import { Request, Response } from "express";
import Card from "../models/card";
import {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
} from "../constants/responseStatusCodes";

export const getCards = (req: Request, res: Response) => {
  return Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) =>
      res.status(INTERNAL_SERVER_ERROR).send({ message: `${err.message}` })
    );
};

export const createCard = (req: Request, res: Response) => {
  const { name, link } = req.body;

  const ownerId = req.user._id;

  return Card.create({ name, link, owner: ownerId })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(BAD_REQUEST).send({ message: `${err.message}` });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: `${err.message}` });
      }
    });
};

export const deleteCard = (req: Request, res: Response) => {
  const { cardId } = req.params;

  return Card.findByIdAndDelete({ _id: cardId })
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else {
        res.status(NOT_FOUND).send({ message: `Нет карточки с id: ${cardId}` });
      }
    })
    .catch((err) =>
      res.status(INTERNAL_SERVER_ERROR).send({ message: `${err.message}` })
    );
};

export const setLike = (req: Request, res: Response) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  return Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND).send({ message: `Нет карточки с id: ${cardId}` });
        return;
      }
      res.send({ data: card });
    })
    .catch((err) =>
      res.status(INTERNAL_SERVER_ERROR).send({ message: `${err.message}` })
    );
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
    .catch((err) =>
      res.status(INTERNAL_SERVER_ERROR).send({ message: `${err.message}` })
    );
};
