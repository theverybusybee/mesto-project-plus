import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import rootRouter from './routes/index';

const { PORT = 3000, BASE_PATH } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req: Request, res: Response, next: NextFunction) => {
  req.user = {
    _id: '6452d4391df55bbb17ff9961',
  };

  next();
});

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(rootRouter);

app.listen(PORT, () => {
  console.log('Ссылка на сервер');
  console.log(BASE_PATH);
});
