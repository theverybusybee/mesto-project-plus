import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/user';
import {
  CREATED,
} from '../constants/responseStatusCodes';
import { Error } from 'mongoose';
import jwt from 'jsonwebtoken';
import { BadRequestError, NotFoundError, UnauthorizedError } from 'errors';

export const createUser = (req: Request, res: Response, next: NextFunction) => {
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
          next(new BadRequestError(err.message));
        }
        next(err);
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
    .catch(() => next(new UnauthorizedError('Неправильные почта или пароль')));
};

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(next);
};

export const getCurrentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(`Нет пользователя с id: ${userId}`);
      }
      res.send(user);
    })

    .catch((err) => {
      if (err instanceof Error.CastError) {
        next(new BadRequestError('_id пользователя невалидный'));
      }
      next(err);
    });
};

export const updateProfile = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
        next(new BadRequestError(err.message));
      }
      next();
    });
};

export const updateAvatar = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { avatar } = req.body;

  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(err.message));
      }
      next(err);
    });
};
