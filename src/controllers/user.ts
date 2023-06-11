import { NextFunction, Request, Response } from 'express';
import User from '../models/user';
import { BadRequestError, NotFoundError } from '../utils/errors';
import Error from 'next/error';

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(next);
};

export const getUserById = (
  req: Request,
  res: Response,
  err: Error,
  next: NextFunction
) => {
  const userId = req.user._id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(`Нет пользователя с id: ${userId}`);
      }
      res.send({ data: user });
    })

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

    .catch(next);
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
