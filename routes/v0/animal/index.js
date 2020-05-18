import { Router } from 'express';
import create from './create';
import read from './read';
import detail from './detail';
import total from './total';
import newKey from './newKey';
import pregnancy from './pregnancy';
import vaccine from './vaccine';
import count from './count';

const router = Router();

/* -------------------------------------------------------------------------- */
/*                                  new apis                                             */
/* -------------------------------------------------------------------------- */
router.get('/newKey', (req, res) => {
  newKey()
    .then(response => res.status(response.status).send({ result: response.result }))
    .catch(response => res.status(response.status).send({ error: response.error }));
});

// router.get('/stock/:limit/:animalKey/:sex/:type/:race', (req, res) => {
//   read(req.params.limit, req.params.animalKey, req.params.sex, req.params.type, req.params.race)
//     .then(response => res.status(response.status).send({ result: response.result }))
//     .catch(response => res.status(response.status).send({ error: response.error }));
// });

router.get('/stock/:string', (req, res) => {
  read(req.params.string)
    .then(response => res.status(response.status).send({ result: response.result }))
    .catch(response => res.status(response.status).send({ error: response.error }));
});

// router.get('/stock/:limit/:animalKey/:sex?/:type?/:entryType?', (req, res) => {
//   console.log('sex is :::: ', req.params.sex);
//   read(
//     req.params.limit,
//     req.params.animalKey,
//     req.params.sex,
//     req.params.type,
//     req.params.entryType
//   )
//     .then(response => res.status(response.status).send({ result: response.result }))
//     .catch(response => res.status(response.status).send({ error: response.error }));
// });

router.get('/detail/:key', (req, res) => {
  detail(req.params.key)
    .then(response => res.status(response.status).send({ details: response.details }))
    .catch(response => res.status(response.status).send({ error: response.error }));
});

router.get('/pregnancy/:key', (req, res) => {
  pregnancy(req.params.key)
    .then(response => res.status(response.status).send({ result: response.result }))
    .catch(response => res.status(response.status).send({ error: response.error }));
});

router.post('/new', (req, res) => {
  create(req.body)
    .then(response => res.status(response.status).send({ result: response.result }))
    .catch(response => res.status(response.status).send({ error: response.error }));
});

router.get('/vaccine/:key', (req, res) => {
  vaccine(req.params.key)
    .then(response => res.status(response.status).send({ result: response.result }))
    .catch(response => res.status(response.status).send({ error: response.error }));
});

router.get('/total', (req, res) => {
  total()
    .then(response => res.status(response.status).send({ result: response.result }))
    .catch(response => res.status(response.status).send({ error: response.error }));
});

router.get('/count', (req, res) => {
  count()
    .then(response => res.status(response.status).send({ result: response.result }))
    .catch(response => res.status(response.status).send({ error: response.error }));
});

export default router;
