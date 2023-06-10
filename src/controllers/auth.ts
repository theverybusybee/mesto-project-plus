import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { HttpStatus } from '../utils/constants/responseStatusCodes';
import ConflictError from '../utils/errors/conflict';
import { BadRequestError, UnauthorizedError } from '../utils/errors';
import { SECRET_KEY } from '../utils/constants/default-data';

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar, email, password } = req.body;
  return bcrypt.hash(password, 10).then((hash: string) =>
    User.create({ name, about, avatar, email, password: hash })
      .then((user) => {
        const { _id } = user;
        res.status(HttpStatus.Created).send({
          _id,
        });
      })
      .catch((err) => {
        let customError = err;
        if (err.name === 'ValidationError') {
          customError = new BadRequestError(err.message);
        }
        if (err.name === 'MongoServerError' && err.code === 11000) {
          customError = new ConflictError(
            'Пользователь с таким email уже существует'
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
        token: jwt.sign({ _id: user._id }, SECRET_KEY, {
          expiresIn: '7d',
        }),
      });
    })
    .catch(() => next(new UnauthorizedError('Неправильные почта или пароль')));
};
