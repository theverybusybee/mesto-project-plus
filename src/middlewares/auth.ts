import { HttpStatus } from '../utils/constants/responseStatusCodes';
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { SECRET_KEY } from '../utils/constants/default-data';

interface SessionRequest extends Request {
  user?: string | JwtPayload;
}

const handleAuthError = (res: Response) => {
  res.status(HttpStatus.Unauthorized).send({ message: 'Необходима авторизация' });
};

const extractBearerToken = (header: string) => {
  return header.replace('Bearer ', '');
};

export default (req: SessionRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError(res);
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, SECRET_KEY);
  } catch (err) {
    return handleAuthError(res);
  }

  req.user = payload;

  next();
};
