import { Router } from 'express';
import create from './create';
import read from './read';
import remove from './remove';
import update from './update';
import createStep from './createStep';
import getDetails from './getDetails';
import getActives from './getActives';

const router = Router();

router.put('/update', (req, res) => {
  console.log(req.body);
  update(req.body)
    .then(response => res.status(response.status).send({ result: response.result }))
    .catch(response => res.status(response.status).send({ error: response.error }));
});

/* -------------------------------------------------------------------------- */
/*                                     new                                    */
/* -------------------------------------------------------------------------- */
router.post('/', (req, res) => {
  create(req.body)
    .then(response => res.status(response.status).send({ result: response.result }))
    .catch(response => res.status(response.status).send({ error: response.error }));
});

router.get('/:key', (req, res) => {
  read(req.params.key)
    .then(response => res.status(response.status).send({ result: response.result }))
    .catch(response => res.status(response.status).send({ error: response.error }));
});

router.delete('/:token/:key/:animalKey/:confirmToDeleteOut', (req, res) => {
  // TODO: after completing exit came back to this
  remove(req.params.token, req.params.key, req.params.animalKey, req.params.confirmToDeleteOut)
    .then(response => res.status(response.status).send({ result: response.result }))
    .catch(response => res.status(response.status).send({ error: response.error }));
});

router.put('/', (req, res) => {
  console.log(req.body);
  update(req.body)
    .then(response => res.status(response.status).send({ result: response.result }))
    .catch(response => res.status(response.status).send({ error: response.error }));
});

router.post('/step', (req, res) => {
  createStep(req.body)
    .then(response => res.status(response.status).send({ result: response.result }))
    .catch(response => res.status(response.status).send({ error: response.error }));
});

router.get('/step/:key', (req, res) => {
  getDetails(req.params.key)
    .then(response => res.status(response.status).send({ result: response.result }))
    .catch(response => res.status(response.status).send({ error: response.error }));
});

router.get('/active/:animalKey', (req, res) => {
  // console.log('getActives, animal key is :: ', req.params.animalKey);
  getActives(req.params.animalKey)
    .then(response => res.status(response.status).send({ result: response.result }))
    .catch(response => res.status(response.status).send({ error: response.error }));
});

export default router;
