import { db, Users, Logs, Vaccines } from '../../../DB/db';
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

export default (token, key) => {
  return new Promise(async (resolve, reject) => {
    try {
      const decoded = await jwt.verify(token, keys.jwtKey);
      console.log(decoded);
      const user = await findUser(decoded);

      const trx = await db.beginTransaction({
        write: ['animals', 'logs', 'vaccines'],
      });

      const vaccine = await trx.run(() => Vaccines.document(key));
      await trx.run(() => Vaccines.update(vaccine, { deleted: true }));

      await trx.run(() =>
        Logs.save({
          value: 'delete',
          type: 'vaccine',
          entryId: vaccine._id,
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
