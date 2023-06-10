import { Response } from 'express';
import cardsRouter from './cards';
import usersRouter from './users';
import { HttpStatus } from '../utils/constants/responseStatusCodes';
import { signInValidator, signUpValidator } from '../utils/validation';
import { createUser, login } from '../controllers/auth';

const rootRouter = require('express').Router();

rootRouter.post('/signin', signInValidator, login);
rootRouter.post('/signup', signUpValidator, createUser);

rootRouter.use('/cards', cardsRouter);
rootRouter.use('/users', usersRouter);

rootRouter.use((req: Request, res: Response) => {
  res.status(HttpStatus.NotFound).send('Page is not found');
});

export default rootRouter;
