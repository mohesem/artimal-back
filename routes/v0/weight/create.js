import { db, Users, Animals, Logs, Weights, AnimalEdges } from '../../../DB/db';
import jwt from 'jsonwebtoken';
import keys from '../../../config/keys';

import { animalNotFound, serverError, successAction } from '../../errors';

const findUser = decoded => {
  return new Promise(async (resolve, reject) => {
    const user = await Users.document(decoded.key);
    if (user) {
      resolve(user);
    } else {
      reject({ status: 400, error: 'دامی با این پلاک وجود ندارد' });
    }
  });
};

export default data => {
  console.log('================================', data);
  return new Promise(async (resolve, reject) => {
    try {
      const decoded = await jwt.verify(data.token, keys.jwtKey);
      const user = await findUser(decoded);
      const animalExists = await Animals.documentExists(`${data.entry.key}`);
      if (!animalExists) reject({ status: 400, error: animalNotFound });

      const animal = await Animals.document(data.entry.key);
      if (animal.out === true) throw { status: 401, error: animalIsOut };

      const trx = await db.beginTransaction({
        write: ['logs', 'animals', 'weights', 'animalEdges'],
      });

      const weight = await trx.run(() =>
        Weights.save({
          value: typeof data.entry.value === 'number' ? data.entry.value : Number(data.entry.value),
          createdAt: Date.now(),
          date: data.entry.date,
          stopFeedingMilk: data.entry.stopFeedingMilk,
        })
      );

      await trx.run(() =>
        AnimalEdges.save({
          value: 'weight',
          _from: `animals/${data.entry.key}`,
          _to: weight._id,
        })
      );

      await trx.run(() =>
        Logs.save({
          value: 'create',
          type: 'weight',
          animalId: animal._id,
          entryId: weight._id,
          userId: user._id,
          createdAt: Date.now(),
        })
      );

      await trx.commit();
      resolve({ status: 200, result: successAction });
    } catch (error) {
      console.log(error);
      if (error.status) reject(error);
      reject({ status: 500, error: serverError });
    }
  });
};
