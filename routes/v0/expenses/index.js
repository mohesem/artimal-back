import { Router } from 'express';
import totalValue from './totalValue';

const router = Router();

router.get('/totalValue/:from/:to', (req, res) => {
  console.log('+++++', { from: req.params.from, to: req.params.to });
  totalValue({ from: req.params.from, to: req.params.to })
    .then(response => res.status(response.status).send({ result: response.result }))
    .catch(response => res.status(response.status).send({ error: response.error }));
});

export default router;
