import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { SECRET_KEY } from '../utils/constants/default-data';
import { UnauthorizedError } from '../utils/errors';
import { IError } from './centralize-error-handler';

interface SessionRequest extends Request {
  user?: string | JwtPayload;
}

const extractBearerToken = (header: string) => header.replace('Bearer ', '');
export default (req: SessionRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    const customError = new UnauthorizedError('Необходима авторизация.');
    next(customError);
    return;
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, SECRET_KEY);
  } catch (err) {
    const customError = new UnauthorizedError('Необходима авторизация.');
    next(customError);
  }

  req.user = payload;

  return next();
};
