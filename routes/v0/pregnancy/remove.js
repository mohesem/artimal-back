import {
  db,
  userCollection,
  animalCollection,
  fromAnimalToPregnancy,
  logCollection,
  pregnancyCollection,
} from '../../../DB/db';
import jwt from 'jsonwebtoken';
import keys from '../../../config/keys';

import { animalNotFound, serverError, successAction, wrongToken, notAllowed } from '../../errors';

// TODO: child edges from fromPregnancyToAnimals must be removed too

const findUser = decoded => {
  return new Promise(async (resolve, reject) => {
    const user = await userCollection.document(decoded.key);
    if (user) {
      if (user.role !== 'admin') reject({ status: 401, error: notAllowed });
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

      const trx = await db.beginTransaction({
        read: ['animals', 'fromAnimalToPregnancy'],
        write: ['animals', 'logs', 'pregnancy', 'fromAnimalToPregnancy'],
      });

      const pregnancy = await trx.run(() => pregnancyCollection.document(data.entry.key));
      const female = await trx.run(() => animalCollection.document(data.entry.femaleKey));

      const inbounds = await db.query(
        `
        FOR v, e IN INBOUND 'pregnancy/${data.entry.key}' fromAnimalToPregnancy
        RETURN e
          `
      );

      console.log(inbounds._result);

      inbounds._result.forEach(async r => {
        await trx.run(() => fromAnimalToPregnancy.update(r, { deleted: true }));
      });

      await trx.run(() => pregnancyCollection.update(pregnancy, { deleted: true }));

      if (!pregnancy.finishedAt) {
        await trx.run(() => animalCollection.update(female, { pregnant: false }));
      }

      await trx.run(() =>
        logCollection.save({
          mode: 'remove',
          type: 'pregnancy',
          enetryKey: pregnancy._key,
          userKey: user._key,
        })
      );

      // await trx.run(() =>
      //   logCollection.save({
      //     mode: 'create',
      //     type: 'pregnancy',
      //     enetryKey: pregnancy._id,
      //     userKey: user._key,
      //   })
      // );

      // const male = await animalCollection.document(data.entry.maleKey);
      // const female = await animalCollection.document(data.entry.femaleKey);

      // await trx.run(() =>
      //   female.update({
      //     pregnant: true,
      //   })
      // );

      // await trx.run(() =>
      //   fromAnimalToPregnancy.save({
      //     _from: male._id,
      //     _to: pregnancy._id,
      //   })
      // );

      // await trx.run(() =>
      //   fromAnimalToPregnancy.save({
      //     _from: female._id,
      //     _to: pregnancy._id,
      //   })
      // );

      await trx.commit();

      resolve({ status: 200, result: successAction });
    } catch (error) {
      console.log(error);
      if (error.status) reject(error);
      reject({ status: 500, error: serverError });
    }
  });
};
