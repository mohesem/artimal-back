import { db, Users, Animals, Diseases, AnimalEdges, Logs } from '../../../DB/db';
import jwt from 'jsonwebtoken';
import keys from '../../../config/keys';

import { animalNotFound, serverError, successAction, wrongToken, animalIsOut } from '../../errors';

const findUser = decoded => {
  return new Promise(async (resolve, reject) => {
    const user = await Users.document(decoded.key);
    if (user) {
      resolve(user);
    } else {
      reject({ status: 400, error: wrongToken });
    }
  });
};

export default data => {
  return new Promise(async (resolve, reject) => {
    try {
      // _* process verify user
      const decoded = await jwt.verify(data.token, keys.jwtKey);
      const user = await findUser(decoded);

      // _* transaction config
      const trx = await db.beginTransaction({
        read: ['animals'],
        write: ['diseases', 'animals', 'animalEdges', 'logs'],
      });

      // _* check animal is not out of stock
      const animal = await Animals.document(data.entry.key);
      if (animal.out === true) throw { status: 401, error: animalIsOut };

      // _* create disease, edge and log
      const disease = await trx.run(() =>
        Diseases.save({
          value: data.entry.value[0],
          date: data.entry.date,
          createdAt: Date.now(),
          comment: data.entry.comment,
          active: true,
        })
      );

      await trx.run(() =>
        AnimalEdges.save({
          value: 'disease',
          _from: `animals/${data.entry.key}`,
          _to: disease._id,
        })
      );

      await trx.run(() =>
        Logs.save({
          value: 'create',
          type: 'disease',
          animalId: animal._id,
          entryId: animal._id,
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
