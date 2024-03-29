import express from 'express';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import rootRouter from './routes/index';
import { requestLogger, errorLogger } from './middlewares/loggers';
import centralizedErrorHandler from './middlewares/centralize-error-handler';
import path from 'path';

const { PORT = 3000, BASE_PATH } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(requestLogger);
app.use('/api', rootRouter);
app.use(express.static(path.join(__dirname, 'public')));



app.use(errorLogger);
app.use(errors());
app.use(centralizedErrorHandler);

app.listen(PORT, () => {
  console.log('Ссылка на сервер');
  console.log(BASE_PATH);
});
