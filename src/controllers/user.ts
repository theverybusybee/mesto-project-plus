import { Request, Response } from 'express';
import User from '../models/user';
import {
  BAD_REQUEST,
  CREATED,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
} from '../constants/responseStatusCodes';
import { Error } from 'mongoose';

export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(CREATED).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: `${err.message}` });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR)
          .send({ message: `Внутренняя ошибка сервера` });
      }
    });
};

export const getUsers = (req: Request, res: Response) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(() =>
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: `Внутренняя ошибка сервера` })
    );
};

export const getUserById = (req: Request, res: Response) => {
  const userId = req.user._id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        res
          .status(NOT_FOUND)
          .send({ message: `Нет пользователя с id: ${userId}` });
        return;
      }
      res.send({ data: user });
    })

    .catch((err) => {
      if (err instanceof Error.CastError) {
        return res.send({
          message: `Пользователя с _id: ${userId} не существует`,
        });
      }
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: `Внутренняя ошибка сервера` });
    });
};

export const updateProfile = (req: Request, res: Response) => {
  const { name, about } = req.body;

  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { name, about },
    { new: true, runValidators: true }
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: `${err.message}` });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR)
          .send({ message: `Внутренняя ошибка сервера` });
      }
    });
};

export const updateAvatar = (req: Request, res: Response) => {
  const { avatar } = req.body;

  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: `${err.message}` });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR)
          .send({ message: `Внутренняя ошибка сервера` });
      }
    });
};
