import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import rootRouter from './routes/index';
import auth from './middlewares/auth';
import { createUser, login } from './controllers/user';

const { PORT = 3000, BASE_PATH } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(rootRouter);

app.listen(PORT, () => {
  console.log('Ссылка на сервер');
  console.log(BASE_PATH);
});
