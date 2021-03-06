import { db, Users, Animals, Logs, Weights } from '../../../DB/db';
import jwt from 'jsonwebtoken';
import keys from '../../../config/keys';

import { animalNotFound, serverError, successAction, wrongToken, notAllowed } from '../../errors';

// TODO: child edges from fromPregnancyToAnimals must be removed too

const findUser = decoded => {
  return new Promise(async (resolve, reject) => {
    const user = await Users.document(decoded.key);
    if (user) {
      if (user.role !== 'admin') reject({ status: 401, error: notAllowed });
      resolve(user);
    } else {
      reject({ status: 400, error: wrongToken });
    }
  });
};

export default data => {
  return new Promise(async (resolve, reject) => {
    try {
      const decoded = await jwt.verify(data.token, keys.jwtKey);
      console.log(decoded);
      const user = await findUser(decoded);

      const trx = await db.beginTransaction({
        read: ['animals'],
        write: ['logs', 'weights'],
      });

      const animal = await trx.run(() => Animals.document(data.entry.key));

      const weight = await trx.run(() => Weights.document(data.entry.key));
      console.log('weight is :: ', weight);

      await trx.run(() =>
        Logs.save({
          value: 'update',
          type: 'weight',
          animalId: animal._id,
          entryId: weight._id,
          userId: user._id,
          form: {
            date: weight.date,
            value: weight.value,
            stopFeedingMilk: weight.stopFeedingMilk,
          },
          to: {
            value:
              typeof data.entry.value === 'number' ? data.entry.value : Number(data.entry.value),
            date: data.entry.date,
            stopFeedingMilk: data.entry.stopFeedingMilk,
          },
          createdAt: Date.now(),
        })
      );
      await trx.run(() =>
        Weights.update(weight, {
          value: typeof data.entry.value === 'number' ? data.entry.value : Number(data.entry.value),
          date: data.entry.date,
          updatedAt: data.entry.updatedAt,
          stopFeedingMilk: data.entry.stopFeedingMilk,
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
