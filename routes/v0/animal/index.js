import { Router } from 'express';
import create from './create';
import read from './read';
import detail from './detail';
import countTotal from './countTotal';

const router = Router();

router.put('/create', (req, res) => {
  create(req.body)
    .then(response => res.status(response.status).send({ msg: response.msg }))
    .catch(response => res.status(response.status).send({ error: response.error }));
});

router.post('/read', (req, res) => {
  read(req.body)
    .then(response => res.status(response.status).send({ results: response.results }))
    .catch(response => res.status(response.status).send({ error: response.error }));
});

router.get('/detail/:key', (req, res) => {
  detail(req.params.key)
    .then(response => res.status(response.status).send({ details: response.details }))
    .catch(response => res.status(response.status).send({ error: response.error }));
});

router.get('/countTotal', (req, res) => {
  countTotal(req.body)
    .then(response => res.status(response.status).send({ result: response.result }))
    .catch(response => res.status(response.status).send({ error: response.error }));
});

export default router;
