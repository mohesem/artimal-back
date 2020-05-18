import { Router } from 'express';
import create from './create';
import read from './read';
import readDetails from './readDetails';
import remove from './remove';

import details from './details';

const router = Router();

router.post('/new', (req, res) => {
  create(req.body)
    .then(response => res.status(response.status).send({ result: response.result }))
    .catch(response => res.status(response.status).send({ error: response.error }));
});

router.post('/read', (req, res) => {
  // console.log('read pregnancy from db : ', req.body);
  read(req.body)
    .then(response => res.status(response.status).send({ result: response.result }))
    .catch(response => res.status(response.status).send({ error: response.error }));
});

router.post('/readDetails', (req, res) => {
  // console.log('read pregnancy details from db : ', req.body);
  readDetails(req.body)
    .then(response => res.status(response.status).send({ result: response.result }))
    .catch(response => res.status(response.status).send({ error: response.error }));
});

router.get('/getActive/:animalKey', (req, res) => {
  console.log('??????????????????', req.params.animalKey);
  // remove(req.body)
  //   .then(response => res.status(response.status).send({ result: response.result }))
  //   .catch(response => res.status(response.status).send({ error: response.error }));
});

/* -------------------------------------------------------------------------- */
/*                                     new                                    */
/* -------------------------------------------------------------------------- */
router.get('/details/:key', (req, res) => {
  details(req.params.key)
    .then(response => res.status(response.status).send({ result: response.result }))
    .catch(response => res.status(response.status).send({ error: response.error }));
});

router.delete('/:token/:key', (req, res) => {
  console.log('got the requset');
  remove(req.params.token, req.params.key)
    .then(response => res.status(response.status).send({ result: response.result }))
    .catch(response => res.status(response.status).send({ error: response.error }));
});

export default router;
