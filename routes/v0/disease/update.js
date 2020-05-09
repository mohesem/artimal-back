import { db, Users, Logs, Diseases } from '../../../DB/db';
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
        read: ['diseases'],
        write: ['logs', 'diseases'],
      });

      const disease = await trx.run(() => Diseases.document(data.entry.key));
      console.log('disease is :: ', disease);

      await trx.run(() =>
        Logs.save({
          value: 'update',
          type: 'disease',
          entryId: disease._id,
          userId: user._id,
          form: {
            value: disease.value,
            date: disease.date,
            updatedAt: disease.updatedAt,
            comment: disease.comment,
          },
          to: {
            value: data.entry.value[0],
            date: data.entry.date,
            updatedAt: data.entry.updatedAt,
            comment: data.entry.comment,
          },
          createdAt: Date.now(),
        })
      );

      await trx.run(() =>
        Diseases.update(disease, {
          value: data.entry.value[0],
          date: data.entry.date,
          updatedAt: data.entry.updatedAt,
          comment: data.entry.comment,
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
