import {
  db,
  userCollection,
  animalCollection,
  milkCollection,
  fromAnimalToMilk,
} from '../../../DB/db';
import jwt from 'jsonwebtoken';
import keys from '../../../config/keys';

import { animalNotFound, serverError, successAction } from '../../errors';

const findUser = decoded => {
  return new Promise(async (resolve, reject) => {
    const user = await userCollection.document(decoded.key);
    if (user) {
      resolve(user);
    } else {
      reject({ status: 400, error: 'دامی با این پلاک وجود ندارد' });
    }
  });
};

export default data => {
  console.log(data);
  return new Promise(async (resolve, reject) => {
    try {
      const decoded = await jwt.verify(data.token, keys.jwtKey);
      await findUser(decoded);
      const animalExists = await animalCollection.documentExists(`${data.entry.key}`);
      if (!animalExists) throw { status: 400, error: animalNotFound };

      const trx = await db.beginTransaction({
        read: ['animals'],
        write: ['milk', 'fromAnimalToMilk'],
      });

      const animal = await animalCollection.document(data.entry.key);

      const milk = await trx.run(() =>
        milkCollection.save({
          date: data.entry.date,
          weight:
            typeof data.entry.weight === 'number' ? data.entry.weight : Number(data.entry.weight),
        })
      );

      await trx.run(() =>
        fromAnimalToMilk.save({
          _from: animal._id,
          _to: milk._id,
        })
      );

      await trx.commit();
      resolve({ status: 200, result: successAction });
    } catch (error) {
      console.log('errrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr');
      if (error.status) reject(error);
      reject({ status: 500, error: serverError });
    }
  });
};
