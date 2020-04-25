import { Router } from 'express';
import create from './create';
import read from './read';

const router = Router();

router.put('/create', (req, res) => {
  create(req.body)
    .then(response => res.status(response.status).send({ result: response.result }))
    .catch(response => res.status(response.status).send({ error: response.error }));
});

router.post('/read', (req, res) => {
  console.log('...............................');
  read(req.body)
    .then(response => res.status(response.status).send({ result: response.result }))
    .catch(response => res.status(response.status).send({ error: response.error }));
});

export default router;
