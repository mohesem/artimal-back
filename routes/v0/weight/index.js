import { Router } from 'express';
import create from './create';
import read from './read';
import remove from './remove';
import update from './update';

const router = Router();

/* -------------------------------------------------------------------------- */
/*                                     new                                    */
/* -------------------------------------------------------------------------- */
router.get('/:animalKey', (req, res) => {
  read(req.params.animalKey)
    .then(response => res.status(response.status).send({ result: response.result }))
    .catch(response => res.status(response.status).send({ error: response.error }));
});

router.post('/new', (req, res) => {
  create(req.body)
    .then(response => res.status(response.status).send({ result: response.result }))
    .catch(response => res.status(response.status).send({ error: response.error }));
});

router.delete('/:token/:key/:animalKey', (req, res) => {
  console.log('reeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeemove');
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
