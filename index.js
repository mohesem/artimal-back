import 'regenerator-runtime/runtime';
import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import Cors from 'cors';
import debug from 'debug';
import logger from 'morgan';

require('./DB/db');
import routes from './routes/routers';

const log = debug('app:server');
const port = process.env.PORT || 4000;

const app = express();

app.use(logget('tiny'));
app.use(Cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/api/v0', routes.v0);

app.listen(port, () => log(`app listen to port ${port}`));
