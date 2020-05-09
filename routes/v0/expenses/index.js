import { Router } from 'express';
import fromTo from './fromTo';

const router = Router();

router.get('/:from/:to', (req, res) => {
  fromTo(req.params.from, req.params.to)
    .then(response => res.status(response.status).send({ result: response.result }))
    .catch(response => res.status(response.status).send({ error: response.error }));
});

export default router;
