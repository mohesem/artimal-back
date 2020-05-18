import { Router } from 'express';
import byPagination from './byPagination';

const router = Router();

/* -------------------------------------------------------------------------- */
/*                                  new apis                                  */
/* -------------------------------------------------------------------------- */
router.get('/pagination/:limit/:page/:collection?/:value?', (req, res) => {
  byPagination(req.params.limit, req.params.page, req.params.collection, req.params.value)
    .then(response => res.status(response.status).send({ result: response.result }))
    .catch(response => res.status(response.status).send({ error: response.error }));
});

export default router;
