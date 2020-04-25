import {
  db,
  userCollection,
  animalCollection,
  vaccineCollection,
  expensesCollection,
  fromAnimalToVaccine,
  fromVaccineToExpenses,
} from '../../../DB/db';
import jwt from 'jsonwebtoken';
import keys from '../../../config/keys';

import { animalNotFound, serverError, successAction, wrongToken } from '../../errors';

const findUser = decoded => {
  return new Promise(async (resolve, reject) => {
    const user = await userCollection.document(decoded.key);
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
      await findUser(decoded);
      const animalExists = await animalCollection.documentExists(`${data.entry.key}`);
      console.log('****&&&^^^', animalExists);
      if (!animalExists) throw new Error({ status: 400, error: animalNotFound });

      const trx = await db.beginTransaction({
        write: ['vaccine', 'animals', 'expenses', 'fromVaccineToExpenses', 'fromAnimalToVaccine'],
      });

      const vaccine = await trx.run(() =>
        vaccineCollection.save({
          userkey: decoded.key,
          username: decoded.username,
          value: data.entry.vaccine[0],
          createdAt: data.entry.date,
        })
      );

      const expense = await trx.run(() =>
        expensesCollection.save({
          value: data.entry.price,
          createdAt: data.entry.date,
          type: 'vaccine',
        })
      );

      await trx.run(() =>
        fromAnimalToVaccine.save({
          createdAt: data.entry.date,
          _from: `animals/${data.entry.key}`,
          _to: vaccine._id,
        })
      );

      await trx.run(() =>
        fromVaccineToExpenses.save({
          _from: vaccine._id,
          _to: expense._id,
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
