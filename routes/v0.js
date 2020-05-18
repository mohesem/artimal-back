import debug from 'debug';
import { Router } from 'express';

import user from './v0/user';
import animal from './v0/animal';
import logs from './v0/logs';
import errors from './v0/errors';
import weight from './v0/weight';
import expenses from './v0/expenses';
import vaccine from './v0/vaccine';
import exit from './v0/exit';
import milk from './v0/milk';
import pregnancy from './v0/pregnancy';
import disease from './v0/disease';

const router = Router();
const log = debug('routes:v0');

router.use('/user', user);
router.use('/animal', animal);
router.use('/logs', logs);

router.use('/errors', errors);
router.use('/weight', weight);
router.use('/expenses', expenses);
router.use('/vaccine', vaccine);
router.use('/exit', exit);
router.use('/milk', milk);
router.use('/pregnancy', pregnancy);
router.use('/disease', disease);

export default router;
