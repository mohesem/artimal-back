import { Router } from 'express';
import byPagination from './byPagination';

const router = Router();

/* -------------------------------------------------------------------------- */
/*                                  new apis                                  */
/* -------------------------------------------------------------------------- */
router.get('/pagination/:limit/:page/:query?', (req, res) => {
  byPagination(req.params.limit, req.params.page, req.params.query)
    .then(response => res.status(response.status).send({ result: response.result }))
    .catch(response => res.status(response.status).send({ error: response.error }));
});

export default router;
