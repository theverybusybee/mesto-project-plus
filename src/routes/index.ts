import { Response } from 'express';
import cardsRouter from './cards';
import usersRouter from './users';
import { NOT_FOUND } from '../constants/responseStatusCodes';

const rootRouter = require('express').Router();

rootRouter.use('/cards', cardsRouter);
rootRouter.use('/users', usersRouter);

rootRouter.use((req: Request, res: Response) => {
  res.status(NOT_FOUND).send('Page is not found');
});

export default rootRouter;
