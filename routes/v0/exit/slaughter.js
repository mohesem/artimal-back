import { db, Users, Animals, Exits, AnimalEdges, Weights, Logs } from '../../../DB/db';
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
      // decode and check user
      const decoded = await jwt.verify(data.token, keys.jwtKey);
      const user = await findUser(decoded);

      // transaction config
      const trx = await db.beginTransaction({
        write: ['animals', 'exits', 'animalEdges', 'weights', 'logs'],
      });

      // get animal and check to see if it is in stock
      const animal = await Animals.document(data.entry.key);
      if (animal.exit) {
        console.log('animal is out');
        throw {
          status: 400,
          error: 'امکان ثبت ذبح برای دامی که از لیست دام های موجود خارج شده است وجود  ندارد',
        };
      }

      // exit animal from stock
      await trx.run(() =>
        Animals.update(animal, {
          exit: true,
        })
      );

      // create exit
      const exit = await trx.run(() =>
        // TODO: create comment later
        Exits.save({
          type: 'slaughter',
          date: data.entry.date,
          // comment: data.entry.comment,
          createdAt: Date.now(),
        })
      );

      // create last weight
      const weight = await trx.run(() =>
        Weights.save({
          value:
            typeof data.entry.weight === 'number' ? data.entry.weight : Number(data.entry.weight),
          createdAt: Date.now(),
          date: data.entry.date,
        })
      );

      await trx.run(() =>
        AnimalEdges.save({
          value: 'weight',
          _from: animal._id,
          _to: weight._id,
        })
      );

      await trx.run(() =>
        AnimalEdges.save({
          value: 'exit',
          _from: animal._id,
          _to: exit._id,
        })
      );

      //create logs
      await trx.run(() =>
        Logs.save({
          value: 'create',
          type: 'exit',
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
          entryId: exit._id,
          userId: user._id,
          createdAt: Date.now(),
        })
      );

      await trx.run(() =>
        Logs.save({
          value: 'create',
          type: 'weight',
          entryId: weight._id,
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
