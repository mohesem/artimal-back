import {
  db,
  Users,
  Animals,
  AnimalEdges,
  Logs,
  DiseaseSteps,
  Diseases,
  Exits,
} from '../../../DB/db';
import jwt from 'jsonwebtoken';
import keys from '../../../config/keys';

import { animalNotFound, serverError, successAction, wrongToken, notAllowed } from '../../errors';

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

// const deleteDisease = async (trx, user, key, animalKey) => {

// };

export default (token, key, animalKey, confirmToDeleteOut) => {
  console.log('kkkkkkkkkkk', { key });
  return new Promise(async (resolve, reject) => {
    try {
      const decoded = await jwt.verify(token, keys.jwtKey);
      const user = await findUser(decoded);

      /*
      NOTE: check if disease caused death an is related to out collection
      */
      const trx = await db.beginTransaction({
        read: ['animals', 'animalEdges', 'diseaseSteps', 'exitEdges', 'exits'],
        write: [
          'exits',
          'animals',
          'logs',
          'diseases',
          'animalEdges',
          'diseaseSteps',
          'diseaseEdges',
          'exitEdges',
        ],
      });

      const animal = await trx.run(() => Animals.document(animalKey));

      const exitToDisease = await db.query(
        `
        FOR v, e IN INBOUND 'diseases/${key}' exitEdges
        FILTER v.deleted != true
        RETURN v
        `
      );

      console.log('___--___--', exitToDisease._result);

      /*
        NOTE: disease is related to out and there is no confirmation to delete out vertex
        ** process
        _* sending an error to get user and get his confirmation for deleting out vertex
      */

      console.log({ confirmToDeleteOut: typeof confirmToDeleteOut });

      if (exitToDisease._result.length && confirmToDeleteOut === 'false') {
        console.log('----------------------------------------------------');
        throw {
          status: 403,
          error:
            'پاک کردن این بیماری منجر به پاک شدن اطلاعات مرتبط با خروج دام میشود. آیا میخواهید ادامه دهید؟',
        };
      } else if (exitToDisease._result.length && confirmToDeleteOut === 'true') {
        /*
          NOTE: disease is related to out but there is confirmation on deleting out vertex
          IMPORTANT: this process will back animal to current stack
            ** process
              _* find animal and update animal {out: false}
              _* delete fromAnimalToOut edge
              _* delete fromOutToDisease edge
              _* delete out
              _* delete disease normaly
        */

        await trx.run(() => Animals.update(animal, { exit: false }));

        console.log({ animal });

        const animalSteps = await db.query(
          `
        FOR v, e IN OUTBOUND 'diseases/${key}' diseaseEdges
        FILTER e.value == 'step'
        FILTER v.deleted != true
        RETURN v
        `
        );

        console.log({ animalSteps });

        const disease = await trx.run(() => Diseases.document(key));
        await trx.run(() => Diseases.update(disease, { deleted: true }));

        animalSteps._result.forEach(async step => {
          console.log({ step });
          await trx.run(() => DiseaseSteps.update(step, { deleted: true }));

          await trx.run(() =>
            Logs.save({
              value: 'delete',
              type: 'diseaseSteps',
              animalId: animal._id,
              entryId: step._id,
              userId: user._id,
              createdAt: Date.now(),
            })
          );
        });

        await trx.run(() =>
          Logs.save({
            value: 'delete',
            type: 'disease',
            animalId: animal._id,
            entryId: disease._id,
            userId: user._id,
            createdAt: Date.now(),
          })
        );

        const exit = await trx.run(() =>
          db.query(`
            FOR v, e IN INBOUND 'diseases/${key}' exitEdges
              FILTER v.deleted != true
              return v
          `)
        );

        await trx.run(() => Exits.update(exit._result[0], { deleted: true }));

        await trx.run(() =>
          Logs.save({
            value: 'update',
            type: 'animal',
            from: {
              exit: true,
            },
            to: {
              exit: false,
            },
            animalId: animal._id,
            entryId: animal._id,
            userId: user._id,
            createdAt: Date.now(),
          })
        );

        await trx.run(() =>
          Logs.save({
            value: 'delete',
            type: 'exit',
            animalId: animal._id,
            entryId: exit._id,
            userId: user._id,
            createdAt: Date.now(),
          })
        );
      } else {
        const animalSteps = await db.query(
          `
        FOR v, e IN OUTBOUND 'diseases/${key}' diseaseEdges
        FILTER e.value == 'step'
        FILTER v.deleted != true
        RETURN v
        `
        );

        const disease = await trx.run(() => Diseases.document(key));
        await trx.run(() => Diseases.update(disease, { deleted: true }));

        animalSteps._result.forEach(async step => {
          console.log({ step });
          await trx.run(() => DiseaseSteps.update(step, { deleted: true }));

          await trx.run(() =>
            Logs.save({
              value: 'delete',
              type: 'diseaseSteps',
              animalId: animal._id,
              entryId: step._id,
              userId: user._id,
              createdAt: Date.now(),
            })
          );
        });

        await trx.run(() =>
          Logs.save({
            value: 'delete',
            type: 'disease',
            animalId: animal._id,
            entryId: disease._id,
            userId: user._id,
            createdAt: Date.now(),
          })
        );
      }

      await trx.commit();
      resolve({ status: 200, result: successAction });
    } catch (error) {
      console.log(error);
      if (error.status) reject(error);
      reject({ status: 500, error: serverError });
    }
  });
};
