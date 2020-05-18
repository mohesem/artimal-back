import { db, Users, Animals, Exits, Incomes, Logs, AnimalEdges } from '../../../DB/db';
import jwt from 'jsonwebtoken';
import keys from '../../../config/keys';

import { animalNotFound, serverError, successAction, wrongToken } from '../../errors';

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
      /*
        ** process
          DONE: check to see if animal is in stock
          DONE: decode token and check if use exists
          DONE: check user authentication
          DONE: update animal {out : true}
          DONE:  create out vertex
          DONE:  create income vertex
          DONE: create animal to out edge
          DONE: create out to income vertex
          _* create animal, out, income logs
      */

      // decode recieved token and find user
      const decoded = await jwt.verify(data.token, keys.jwtKey);
      const user = await findUser(decoded);

      const trx = await db.beginTransaction({
        read: ['animals'],
        write: ['animals', 'exits', 'incomes', 'animalEdges', 'logs'],
      });

      // check is animal in stock or not
      const animal = await trx.run(() => Animals.document(data.entry.key));
      if (animal.exit) {
        throw {
          status: 400,
          error: 'امکان ثبت فروش برای دامی که از لیست دام های موجود خارج شده است وجود  ندارد',
        };
      }

      // update animal
      await trx.run(() =>
        Animals.update(animal, {
          exit: true,
        })
      );

      // create exit
      const exit = await trx.run(() =>
        Exits.save({
          type: 'sell',
          date: data.entry.date,
          comment: data.entry.comment,
          createdAt: Date.now(),
        })
      );

      // create income
      const income = await trx.run(() =>
        Incomes.save({
          type: 'sell',
          date: data.entry.date,
          price: typeof data.entry.price === 'number' ? data.entry.price : Number(data.entry.price),
          createdAt: Date.now(),
        })
      );

      // animal to income edge
      await trx.run(() =>
        AnimalEdges.save({
          value: 'exit',
          _from: animal._id,
          _to: income._id,
        })
      );

      // out to income edge
      await trx.run(() =>
        AnimalEdges.save({
          value: 'income',
          _from: animal._id,
          _to: exit._id,
        })
      );

      // create logs
      await trx.run(() =>
        Logs.save({
          value: 'create',
          type: 'exit',
          animalId: animal._id,
          entryId: exit._id,
          userId: user._id,
          createdAt: Date.now(),
        })
      );

      await trx.run(() =>
        Logs.save({
          value: 'update',
          type: 'animal',
          from: {
            exit: animal.exit,
          },
          to: {
            exit: true,
          },
          animalId: animal._id,
          entryId: exit._id,
          userId: user._id,
          createdAt: Date.now(),
        })
      );

      await trx.run(() =>
        Logs.save({
          value: 'create',
          type: 'income',
          animalId: animal._id,
          entryId: income._id,
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
