import { Router } from 'express';
import create from './create';
import read from './read';
import remove from './remove';
import update from './update';

const router = Router();

router.post('/read', (req, res) => {
  read(req.body)
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

router.delete('/:token/:key/:animalKey', (req, res) => {
  remove(req.params.token, req.params.key, req.params.animalKey)
    .then(response => res.status(response.status).send({ result: response.result }))
    .catch(response => res.status(response.status).send({ error: response.error }));
});

router.put('/', (req, res) => {
  update(req.body)
    .then(response => res.status(response.status).send({ result: response.result }))
    .catch(response => res.status(response.status).send({ error: response.error }));
});
export default router;
