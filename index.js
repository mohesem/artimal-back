import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import Cors from 'cors';
import debug from 'debug';
require('./DB/db');
import routes from './routes/routers';

import bcrypt from 'bcryptjs';
import keys from './config/keys';
import { userCollection } from './DB/db';

const log = debug('app:server');
const port = process.env.PORT || 4000;

const app = express();

console.log('......................', process.env.ENV);

app.use(Cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

bcrypt.hash('admin' + keys.passwordKey, keys.passwordSalt, async (err, hash) => {
  if (err) reject({ msg: 'internal server error' });
  const saveUser = await userCollection.save({
    username: 'admin',
    password: hash,
    role: 'admin',
  });

  console.log('.............', saveUser);
});

app.use('/api/v0', routes.v0);

app.listen(port, () => log(`app listen to port ${port}`));
