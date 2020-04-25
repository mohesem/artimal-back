import { Router } from 'express';

import newKey from './newKey';

const router = Router();

router.get('/new', (req, res) => {
  newKey()
    .then(response => res.status(response.status).send({ count: response.count }))
    .catch(response => res.status(response.status).send({ error: response.error }));
});

export default router;
