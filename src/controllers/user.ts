import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/user';
import { statusCodes } from '../utils/constants/responseStatusCodes';
import { Error } from 'mongoose';
import jwt from 'jsonwebtoken';
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from '../utils/errors';
import ConflictError from '../utils/errors/conflict';

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar, email, password } = req.body;
  return bcrypt.hash(password, 10).then((hash: string) =>
    User.create({ name, about, avatar, email, password: hash })
      .then((user) => {
        const { _id } = user;
        res.status(statusCodes.Created).send({
          _id,
        });
      })
      .catch((err) => {
        let customError = err;
        if (err.name === 'ValidationError') {
          customError = new BadRequestError(err.message);
        }
        if (err.code === 1100) {
          customError = new ConflictError(
            'Пользователь с таким email не существует'
          );
        }
        next(customError);
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
      let customError = err;
      if (err instanceof Error.CastError) {
        customError = new BadRequestError('_id пользователя невалидный');
      }
      next(customError);
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
      let customError = err;
      if (err.name === 'ValidationError') {
        customError = new BadRequestError(err.message);
      }
      next(customError);
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
      let customError = err;
      if (err.name === 'ValidationError') {
        customError = new BadRequestError(err.message);
      }
      next(customError);
    });
};
