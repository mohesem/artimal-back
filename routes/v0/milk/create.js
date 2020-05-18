import { db, Users, Animals, Milks, AnimalEdges, Logs } from '../../../DB/db';
import jwt from 'jsonwebtoken';
import keys from '../../../config/keys';

import { animalNotFound, serverError, unauthorized, successAction } from '../../errors';

const findUser = decoded => {
  return new Promise(async (resolve, reject) => {
    const user = await Users.document(decoded.key);
    if (user) {
      resolve(user);
    } else {
      reject({ status: 400, error: unauthorized });
    }
  });
};

export default data => {
  console.log('::::::::', data);
  return new Promise(async (resolve, reject) => {
    try {
      const decoded = await jwt.verify(data.token, keys.jwtKey);
      const user = await findUser(decoded);

      // const animalExists = await Animals.documentExists(`${data.entry.key}`);
      // if (!animalExists) throw { status: 400, error: animalNotFound };

      const trx = await db.beginTransaction({
        read: ['animals'],
        write: ['milks', 'animalEdges', 'logs'],
      });

      const animal = await trx.run(() => Animals.document(data.entry.key));
      if (animal.sex !== 1) throw { error: 'امکان ثبت رکرد شیر فقط برای دام های ماده ممکن است' };

      const milk = await trx.run(() =>
        Milks.save({
          date: data.entry.date,
          value: typeof data.entry.value === 'number' ? data.entry.value : Number(data.entry.value),
          createdAt: Date.now(),
        })
      );

      await trx.run(() =>
        AnimalEdges.save({
          value: 'milk',
          _from: animal._id,
          _to: milk._id,
        })
      );

      await trx.run(() =>
        Logs.save({
          value: 'create',
          type: 'milk',
          animalId: animal._id,
          entryId: milk._id,
          userId: user._id,
          createdAt: Date.now(),
        })
      );

      await trx.commit();
      resolve({ status: 200, result: successAction });
    } catch (error) {
      console.log(error);
      if (error.response && error.response.body) {
        const errorMessage = () => {
          if (error.response.body.code === 404) return 'سند مورد نظر یافت نشد';
        };
        reject({ status: error.response.body.code, error: errorMessage() });
      } else if (error.status) {
        reject(error);
      } else {
        reject({ status: 500, error: serverError });
      }
    }
  });
};
