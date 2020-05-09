import { Router } from 'express';
import login from './login';
import getByToken from './getByToken';

const router = Router();

router.post('/login', (req, res) => {
  login(req.body)
    .then(response => res.status(response.status).send({ token: response.token }))
    .catch(response => res.status(response.status).send({ error: response.error }));
});

/* -------------------------------------------------------------------------- */
/*                                    READ                                    */
/* -------------------------------------------------------------------------- */
router.get('/token/:token', (req, res) => {
  getByToken(req.params.token)
    .then(response => res.status(response.status).send({ result: response.result }))
    .catch(response => res.status(response.status).send({ error: response.error }));
});

export default router;
