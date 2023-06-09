import { INTERNAL_SERVER_ERROR } from 'constants/responseStatusCodes';
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
  const { statusCode = INTERNAL_SERVER_ERROR, message } = err;

  res.status(statusCode).send({
    message:
      statusCode === INTERNAL_SERVER_ERROR
        ? 'На сервере произошла ошибка'
        : message,
  });
  return next();
};

export default centralizedErrorHandler;
