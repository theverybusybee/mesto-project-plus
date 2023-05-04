import { NextFunction, Request, Response } from "express";
import User from "../models/user";
import {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
} from "../constants/responseStatusCodes";

export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;

  return User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(BAD_REQUEST).send({ message: `${err.message}` });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: `${err.message}` });
      }
    });
};

export const getUsers = (req: Request, res: Response, next: NextFunction) => {

  return User.find({})
    .then((user) => res.send({ data: user }))
    .catch((err) =>
      res.status(INTERNAL_SERVER_ERROR).send({ message: `${err.message}` })
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
      res.status(INTERNAL_SERVER_ERROR).send({ message: `${err.message}` });
    });
};

export const updateProfile = (req: Request, res: Response) => {
  const { name, about } = req.body;

  const userId = req.user._id;

  return User.findByIdAndUpdate(userId, { name, about })
    .then((user) => res.send({ data: user }))
    .catch((err) =>
      res
        .status(err.status || BAD_REQUEST)
        .send({ message: `${err.message || err}` })
    );
};

export const updateAvatar = (req: Request, res: Response) => {
  const { avatar } = req.body;

  const userId = req.user._id;

  return User.findByIdAndUpdate(userId, { avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) =>
      res
        .status(err.status || BAD_REQUEST)
        .send({ message: `${err.message || err}` })
    );
};
