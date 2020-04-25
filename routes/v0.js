import debug from 'debug';
import { Router } from 'express';

// import signin from './v0/signin';
// import isUser from './v0/isUser';
// import newAnimal from './v0/newAnimal';
// import getNewPlaque from './v0/getNewPlaque';
// import searchPlaqueFromStart from './v0/searchPlaqueFromStart';
// import getAnimalDetails from './v0/getAnimalDetails';
// import putWeight from './v0/putWeight';

import user from './v0/user';
import animal from './v0/animal';
import key from './v0/key';
import weight from './v0/weight';
import expenses from './v0/expenses';
import vaccine from './v0/vaccine';

const router = Router();
const log = debug('routes:v0');

router.use('/user', user);
router.use('/animal', animal);
router.use('/key', key);
router.use('/weight', weight);
router.use('/expenses', expenses);
router.use('/vaccine', vaccine);

// router.post('/signin', (req, res) => {
//   signin(req.body)
//     .then(token => res.status(200).send({ token }))
//     .catch(err => {
//       console.log('............', err);
//       res.status(400).send(err);
//     });
// });

// router.post('/isUser', (req, res) => {
//   isUser(req.body)
//     .then(() => res.status(200).send({ authenticated: true }))
//     .catch(() => {
//       res.status(401).send({ authenticated: false });
//     });
// });

// router.post('/newAnimal', (req, res) => {
//   console.log(req.body);
//   newAnimal(req.body)
//     .then(msg => res.status(200).send(msg))
//     .catch(err => {
//       console.log('............', err);
//       res.status(400).send(err);
//     });
// });

// router.get('/newPlaque', (req, res) => {
//   getNewPlaque()
//     .then(response => {
//       res.status(response.status).send({ newKey: response.count });
//     })
//     .catch(err => {
//       res.status(err.status).send({ msg: err.msg });
//     });
// });

// router.post('/searchPlaqueFromStart', (req, res) => {
//   searchPlaqueFromStart(req.body)
//     .then(response => {
//       res.status(response.status).send({ results: response.results });
//     })
//     .catch(err => {
//       res.status(err.status).send({ msg: err.msg });
//     });
// });

// router.get('/getAnimalDetails/:plaque', (req, res) => {
//   getAnimalDetails(req.params.plaque)
//     .then(response => {
//       console.log(response);

//       res.status(response.status).send({ searchResult: response.searchResult });
//     })
//     .catch(err => {
//       res.status(err.status).send({ msg: err.msg });
//     });
// });

// router.put('/put/weight', (req, res) => {
//   putWeight(req.body)
//     .then(response => {
//       console.log(response);

//       res.status(response.status).send({ result: res.result });
//     })
//     .catch(err => {
//       res.status(err.status).send({ error: res.error });
//     });
// });

export default router;
