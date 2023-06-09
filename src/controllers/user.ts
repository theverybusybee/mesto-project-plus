import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/user';
import {
  BAD_REQUEST,
  CREATED,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  OK,
  UNAUTHORIZED,
} from '../constants/responseStatusCodes';
import { Error } from 'mongoose';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../constants/default-data';

export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar, email, password } = req.body;
  return bcrypt.hash(password, 10).then((hash: string) =>
    User.create({ name, about, avatar, email, password: hash })
      .then((user) => {
        const { _id } = user;
        res.status(CREATED).send({
          _id,
        });
      })
      .catch((err) => {
        if (err.name === 'ValidationError') {
          res.status(BAD_REQUEST).send({ message: `${err.message}` });
        } else {
          res
            .status(INTERNAL_SERVER_ERROR)
            .send({ message: `Внутренняя ошибка сервера` });
        }
      })
  );
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, 'super-strong-secret', {
        expiresIn: '7d',
      }),
      });
    })
    .catch(() =>
      res
        .status(UNAUTHORIZED)
        .send({ message: 'Неправильные почта или пароль' })
    );
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

export const getCurrentUser = (req: Request, res: Response) => {
  const userId = req.user;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        res
          .status(NOT_FOUND)
          .send({ message: `Нет пользователя с id: ${userId}` });
        return;
      }
      res.send(user);
    })

    .catch((err) => {
      if (err instanceof Error.CastError) {
        return res
          .status(BAD_REQUEST)
          .send({ message: `_id пользователя невалидный` });
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
