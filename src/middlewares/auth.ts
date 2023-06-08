import { SECRET_KEY } from 'constants/dafault-data';
import { UNAUTHORIZED } from 'constants/responseStatusCodes';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export default (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(UNAUTHORIZED).send({ message: 'Необходима авторизация' });
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, SECRET_KEY);
  } catch (err) {
    return res.status(UNAUTHORIZED).send({ message: 'Необходима авторизация' });
  }

  req.user = payload;

  next();
};
