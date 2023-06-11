import { NextFunction, Request, Response } from 'express';
import { HttpStatus } from '../utils/constants/responseStatusCodes';

export interface IError extends Error {
  statusCode: number;
}

const centralizedErrorHandler = (
  err: IError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { statusCode = HttpStatus.INTERNAL_SERVER_ERROR, message } = err;

  res.status(statusCode).send({
    message:
      statusCode === HttpStatus.INTERNAL_SERVER_ERROR
        ? 'На сервере произошла ошибка'
        : message,
  });
  return next();
};

export default centralizedErrorHandler;
