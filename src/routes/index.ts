import { Response } from 'express';
import cardsRouter from './cards';
import usersRouter from './users';
import { HttpStatus } from '../utils/constants/responseStatusCodes';
import { signInValidator, signUpValidator } from '../utils/validation';
import { createUser, login } from '../controllers/auth';
import auth from '../middlewares/auth';

const rootRouter = require('express').Router();

rootRouter.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

rootRouter.post('/signin', signInValidator, login);
rootRouter.post('/signup', signUpValidator, createUser);

rootRouter.use(auth);
rootRouter.use('/cards', cardsRouter);
rootRouter.use('/users', usersRouter);

rootRouter.use((req: Request, res: Response) => {
  res.status(HttpStatus.NOT_FOUND).send('Page is not found');
});

export default rootRouter;
