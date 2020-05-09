import { Router } from 'express';
import death from './death';
import sell from './sell';
import slaughter from './slaughter';
import get from './get';

const router = Router();

/* -------------------------------------------------------------------------- */
/*                                     new                                    */
/* -------------------------------------------------------------------------- */
router.get('/:animalKey', (req, res) => {
  get(req.params.animalKey)
    .then(response => res.status(response.status).send({ result: response.result }))
    .catch(response => res.status(response.status).send({ error: response.error }));
});

router.post('/sell', (req, res) => {
  sell(req.body)
    .then(response => res.status(response.status).send({ result: response.result }))
    .catch(response => res.status(response.status).send({ error: response.error }));
});

router.post('/slaughter', (req, res) => {
  slaughter(req.body)
    .then(response => res.status(response.status).send({ msg: response.msg }))
    .catch(response => res.status(response.status).send({ error: response.error }));
});

router.post('/death', (req, res) => {
  death(req.body)
    .then(response => res.status(response.status).send({ result: response.result }))
    .catch(response => res.status(response.status).send({ error: response.error }));
});
export default router;
