import { db, Users, Logs, Milks, Animals } from '../../../DB/db';
import jwt from 'jsonwebtoken';
import keys from '../../../config/keys';

import { successAction, serverError, wrongToken, notAllowed } from '../../errors';

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

export default (token, key, animalKey) => {
  return new Promise(async (resolve, reject) => {
    try {
      const decoded = await jwt.verify(token, keys.jwtKey);
      console.log(decoded);
      const user = await findUser(decoded);

      const trx = await db.beginTransaction({
        read: ['milks', 'animals'],
        write: ['logs', 'milks'],
      });

      const animal = await trx.run(() => Animals.document(animalKey));
      const milk = await trx.run(() => Milks.document(key));
      await trx.run(() => Milks.update(milk, { deleted: true, deleteDate: Date.now() }));

      await trx.run(() =>
        Logs.save({
          value: 'delete',
          type: 'milk',
          animalId: animal._id,
          entryId: milk._id,
          userId: user._id,
          createdAt: Date.now(),
        })
      );

      // await trx.commit();
      // resolve({ status: 200, result: successAction });
    } catch (error) {
      console.log(error);
      if (error.status) reject(error);
      reject({ status: 500, error: serverError });
    }
  });
};
