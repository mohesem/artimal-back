import { db, Users, Logs, Vaccines, Animals } from '../../../DB/db';
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
        write: ['logs', 'vaccines'],
      });

      const animal = await trx.run(() => Animals.document(data.entry.key));

      const vaccine = await trx.run(() => Vaccines.document(data.entry.key));

      await trx.run(() =>
        Logs.save({
          value: 'update',
          type: 'vaccine',
          animalId: animal._id,
          entryId: vaccine._id,
          userId: user._id,
          form: {
            date: vaccine.date,
            value: vaccine.value,
            updatedAt: vaccine.updatedAt,
          },
          to: {
            value: data.entry.value,
            date: data.entry.date,
            updatedAt: data.entry.updatedAt,
          },
          createdAt: Date.now(),
        })
      );

      await trx.run(() =>
        Vaccines.update(vaccine, {
          value: data.entry.value,
          date: data.entry.date,
          updatedAt: data.entry.updatedAt,
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
