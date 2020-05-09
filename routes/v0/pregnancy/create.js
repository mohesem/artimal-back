import { db, Users, Animals, AnimalEdges, Logs, Pregnancies } from '../../../DB/db';
import jwt from 'jsonwebtoken';
import keys from '../../../config/keys';

import { animalNotFound, serverError, successAction, wrongToken } from '../../errors';

// TODO: check to see if there is any acitve pregnancy. if there was throw err

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

      const maleExists = await Animals.documentExists(data.entry.maleKey);
      if (!maleExists) throw { status: 400, error: animalNotFound };

      const femaleExists = await Animals.documentExists(data.entry.femaleKey);
      if (!femaleExists) throw { status: 400, error: animalNotFound };

      const trx = await db.beginTransaction({
        read: ['animals'],
        write: ['animals', 'logs', 'pregnancies', 'animalEdges'],
      });

      const pregnancyObj = {
        startedAt: data.entry.date,
        createdAt: Date.now(),
        active: true,
      };
      if (data.entry.note) pregnancyObj.notes = [data.entry.note];

      const pregnancy = await trx.run(() => Pregnancies.save(pregnancyObj));
      console.log('ppppppppppppppp is : ', pregnancy);

      const male = await Animals.document(data.entry.maleKey);
      const female = await Animals.document(data.entry.femaleKey);

      if (female.pregnant === true)
        throw { status: 401, error: 'امکان ثبت بارداری برای دام ماده ای که باردار است وجود ندارد' };

      await trx.run(() => Animals.update(female, { pregnant: true }));

      await trx.run(() =>
        AnimalEdges.save({
          value: 'pregnancy',
          sex: '0',
          _from: male._id,
          _to: pregnancy._id,
        })
      );

      await trx.run(() =>
        AnimalEdges.save({
          value: 'pregnancy',
          sex: '1',
          _from: female._id,
          _to: pregnancy._id,
        })
      );

      await trx.run(() =>
        Logs.save({
          value: 'create',
          type: 'pregnancy',
          entryId: pregnancy._id,
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
