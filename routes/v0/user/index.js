import { Router } from 'express';
import signin from './signin';
import verify from './verify';

const router = Router();

router.post('/signin', (req, res) => {
  signin(req.body)
    .then(response => res.status(response.status).send({ token: response.token }))
    .catch(response => res.status(response.status).send({ error: response.error }));
});

/* -------------------------------------------------------------------------- */
/*                                    READ                                    */
/* -------------------------------------------------------------------------- */
router.post('/verify', (req, res) => {
  verify(req.body)
    .then(response => res.status(response.status).send({ msg: response.msg }))
    .catch(response => res.status(response.status).send({ error: response.error }));
});

export default router;
