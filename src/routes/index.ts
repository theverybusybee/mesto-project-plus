import { Response } from 'express';
import cardsRouter from './cards';
import usersRouter from './users';
import { statusCodes } from '../utils/constants/responseStatusCodes';

const rootRouter = require('express').Router();

rootRouter.use('/cards', cardsRouter);
rootRouter.use('/users', usersRouter);

rootRouter.use((req: Request, res: Response) => {
  res.status(statusCodes.NotFound).send('Page is not found');
});

export default rootRouter;
