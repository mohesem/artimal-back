import { db, Users, Logs, Milks, Animals } from '../../../DB/db';
import jwt from 'jsonwebtoken';
import keys from '../../../config/keys';

import { animalNotFound, serverError, successAction, wrongToken, notAllowed } from '../../errors';

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
        write: ['logs', 'milks'],
      });

      const animal = await trx.run(() => Animals.document(data.entry.animalKey));

      const milk = await trx.run(() => Milks.document(data.entry.key));
      console.log('miiiilk is :: ', milk);

      await trx.run(() =>
        Logs.save({
          value: 'update',
          type: 'milk',
          animalId: animal._id,
          entryId: milk._id,
          userId: user._id,
          form: {
            date: milk.date,
            value: milk.value,
            stopFeedingMilk: milk.stopFeedingMilk,
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
        Milks.update(milk, {
          value: typeof data.entry.value === 'number' ? data.entry.value : Number(data.entry.value),
          date: data.entry.date,
          updatedAt: Date.now(),
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
