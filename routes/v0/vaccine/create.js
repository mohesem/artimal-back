import { db, Users, Animals, Vaccines, AnimalEdges, Logs } from '../../../DB/db';
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
  console.log(data);
  return new Promise(async (resolve, reject) => {
    try {
      const decoded = await jwt.verify(data.token, keys.jwtKey);
      console.log(decoded);
      const user = await findUser(decoded);
      const animalExists = await Animals.documentExists(`${data.entry.key}`);
      console.log('****&&&^^^', animalExists);
      if (!animalExists) throw { status: 400, error: animalNotFound };

      const trx = await db.beginTransaction({
        read: ['animals'],
        write: ['vaccines', 'animals', 'animalEdges', 'logs'],
      });

      const animal = await Animals.document(data.entry.key);
      if (animal.out === true) throw { status: 401, error: animalIsOut };

      console.log('animal is ::: ', animal);

      const vaccine = await trx.run(() =>
        Vaccines.save({
          value: data.entry.vaccine,
          date: data.entry.date,
          createdAt: Date.now(),
        })
      );

      await trx.run(() =>
        AnimalEdges.save({
          value: 'vaccine',
          _from: animal._id,
          _to: vaccine._id,
        })
      );

      await trx.run(() =>
        Logs.save({
          value: 'create',
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
