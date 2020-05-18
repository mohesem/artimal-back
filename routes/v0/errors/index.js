import { Router } from 'express';
import pagination from './pagination';

const router = Router();

/* -------------------------------------------------------------------------- */
/*                                     new                                    */
/* -------------------------------------------------------------------------- */

router.get('/pagination/:limit/:page', (req, res) => {
  console.log('__--__-_--_-----_');
  pagination(req.params.limit, req.params.page)
    .then(response => res.status(response.status).send({ result: response.result }))
    .catch(response => res.status(response.status).send({ error: response.error }));
});
export default router;
