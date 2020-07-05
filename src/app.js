import { urlencoded, json } from 'body-parser';
import express from 'express';
import Agendash from 'agendash';
import connectDb from './config/db.mongo';
import agenda from './config/agenda';
import routes from './routes/index';

connectDb();
const app = express();
app.use('/dash', Agendash(agenda));

app.use(urlencoded({ extended: true }));
app.use(json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

routes(app);

export default app;
