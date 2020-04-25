import {
  db,
  userCollection,
  animalCollection,
  logCollection,
  weightCollection,
  fromAnimalToWeight,
} from '../../../DB/db';
import jwt from 'jsonwebtoken';
import keys from '../../../config/keys';

import { animalNotFound, serverError, successAction } from '../../errors';

const findUser = decoded => {
  return new Promise(async (resolve, reject) => {
    const user = await userCollection.document(decoded.key);
    if (user) {
      resolve(user);
    } else {
      reject({ status: 400, error: 'دامی با این پلاک وجود ندارد' });
    }
  });
};

export default data => {
  console.log(data);
  return new Promise(async (resolve, reject) => {
    try {
      const decoded = await jwt.verify(data.token, keys.jwtKey);
      await findUser(decoded);
      const animalExists = await animalCollection.documentExists(`${data.entry.key}`);
      if (!animalExists) reject({ status: 400, error: animalNotFound });

      const trx = await db.beginTransaction({
        write: ['logs', 'animals', 'weights', 'fromAnimalToWeight'],
      });

      const weight = await trx.run(() =>
        weightCollection.save({
          userkey: decoded.key,
          username: decoded.username,
          weight:
            typeof data.entry.weight === 'number' ? data.entry.weight : Number(data.entry.weight),
          createdAt: data.entry.date,
        })
      );

      const log = await trx.run(() =>
        logCollection.save({
          userkey: decoded.key,
          username: decoded.username,
          action: 'PUT-weight',
          animalKey: data.entry.key,
          weightKey: weight._key,
          createdAt: data.entry.date,
        })
      );

      await trx.run(() =>
        fromAnimalToWeight.save({
          _from: `animals/${data.entry.key}`,
          _to: weight._id,
        })
      );

      await trx.commit();
      resolve({ status: 200, result: successAction });
    } catch (error) {
      if (error.status) reject(error);
      reject({ status: 500, error: serverError });
    }
  });
};
