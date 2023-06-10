import { HttpStatus } from '../utils/constants/responseStatusCodes';
import { NextFunction, Request, Response } from 'express';

export interface IError extends Error {
  statusCode: number;
}

const centralizedErrorHandler = (
  err: IError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { statusCode = HttpStatus.InternalServerError, message } = err;

  res.status(statusCode).send({
    message:
      statusCode === HttpStatus.InternalServerError
        ? 'На сервере произошла ошибка'
        : message,
  });
  return next();
};

export default centralizedErrorHandler;
