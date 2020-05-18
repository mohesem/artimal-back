import { db, Animals, Users, Diseases, DiseaseSteps, DiseaseEdges, Logs } from '../../../DB/db';
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
  console.log('---------------------------', data);
  return new Promise(async (resolve, reject) => {
    try {
      const decoded = await jwt.verify(data.token, keys.jwtKey);
      console.log(decoded);
      const user = await findUser(decoded);

      const animal = await Animals.document(data.entry.animalKey);
      if (animal.out === true) throw { status: 401, error: animalIsOut };

      const trx = await db.beginTransaction({
        read: ['diseases'],
        write: ['diseases', 'diseaseSteps', 'diseaseEdges', 'logs'],
      });

      const disease = await trx.run(() => Diseases.document(data.entry.key));

      if (disease.isCured)
        throw { status: 401, error: 'امکان ثبت وضعیت جدید برای بیماری ای که فعال نیست وجود ندارد' };

      console.log('disease is :: ', disease);

      if (data.entry.isCured) {
        await trx.run(() => Diseases.update(disease, { active: false }));
      }

      const related = await trx.run(() =>
        DiseaseSteps.save({
          drugs: data.entry.drugs,
          effects: data.entry.effects,
          // updatedAt: data.entry.updatedAt,
          date: data.entry.date,
          treatment: data.entry.treatment,
          comment: data.entry.comment,
          isCured: data.entry.isCured,
        })
      );

      console.log('related is ::: ', related);

      await trx.run(() =>
        DiseaseEdges.save({
          value: 'step',
          _from: disease._id,
          _to: related._id,
        })
      );

      await trx.run(() =>
        Logs.save({
          value: 'create',
          type: 'diseaseStep',
          animalId: animal._id,
          entryId: disease._id,
          userId: user._id,
          createdAt: Date.now(),
        })
      );

      // console.log('animal is ::: ', animal);

      // const disease = await trx.run(() =>
      //   diseaseCollection.save({
      //     value: data.entry.value[0],
      //     date: data.entry.date,
      //     createdAt: data.entry.createdAt,
      //     comment: data.entry.comment,
      //     // active: true,
      //   })
      // );

      // await trx.run(() =>
      //   fromAnimalToDisease.save({
      //     _from: `animals/${data.entry.key}`,
      //     _to: disease._id,
      //   })
      // );

      // await trx.run(() =>
      //   logCollection.save({
      //     mode: 'create',
      //     type: 'diseaseRelated',
      //     enetryKey: related._key,
      //     userKey: user._key,
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
