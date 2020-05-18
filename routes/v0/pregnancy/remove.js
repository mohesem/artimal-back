import { db, Users, Animals, AnimalEdges, Logs, Pregnancies, PregnancyEdges } from '../../../DB/db';
import jwt from 'jsonwebtoken';
import keys from '../../../config/keys';

import { animalNotFound, serverError, successAction, wrongToken, notAllowed } from '../../errors';

// TODO: child edges from fromPregnancyToAnimals must be removed too

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

const addError = async (trx, user, pregnancy, childResults) => {
  console.log('iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiin');
  return new Promise(async resolve => {
    await childResults.forEach(async (child, i) => {
      const errors = child.errors
        ? [...child.errors, 'hasNoPregnancyRecord']
        : ['hasNoPregnancyRecord'];
      await trx.run(() => Animals.update(child, { errors }));
      await trx.run(() =>
        Logs.save({
          value: 'error',
          type: 'hasNoPregnancyRecord',
          entryId: child._id,
          userId: user._id,
          createdAt: Date.now(),
          previousPregnancyId: pregnancy._id,
        })
      );

      console.log(';;;;;;;;;;;;;;;;;,');

      if (i === childResults.length - 1) resolve();
    });
  });
};

export default (token, key) => {
  return new Promise(async (resolve, reject) => {
    try {
      const decoded = await jwt.verify(token, keys.jwtKey);
      const user = await findUser(decoded);

      const trx = await db.beginTransaction({
        read: ['animals', 'pregnancies', 'pregnancyEdges'],
        write: ['animals', 'logs', 'pregnancies'],
      });

      const pregnancy = await trx.run(() => Pregnancies.document(key));

      const childs = await trx.run(() =>
        db.query(
          `
            FOR vertex , edge IN OUTBOUND '${pregnancy._id}' pregnancyEdges
            FILTER vertex.deleted != true
            RETURN vertex
          `
        )
      );

      const childResults = childs._result;

      const parents = await trx.run(() =>
        db.query(
          `
          FOR vertex , edge IN INBOUND '${pregnancy._id}' animalEdges
          FILTER vertex.deleted != true
          RETURN vertex
          `
        )
      );

      const parentsResult = parents._result;

      const female = parentsResult.filter(e => e.sex === 1)[0];

      /* if there was no child
          if pregnancy was active update animal {pregnant = false} and delete pregnancy
    */

      if (pregnancy.active) {
        await trx.run(() => Animals.update(female, { pregnant: false, updatedAt: Date.now() }));

        await trx.run(() =>
          Logs.save({
            value: 'delete',
            type: 'pregnancy',
            entryId: pregnancy._id,
            userId: user._id,
            createdAt: Date.now(),
            from: {
              pregnant: true,
            },
            to: {
              pregnant: false,
            },
          })
        );
      }

      await trx.run(() => Pregnancies.update(pregnancy, { deleted: true, deletedAt: Date.now() }));

      await trx.run(() =>
        Logs.save({
          value: 'delete',
          type: 'pregnancy',
          entryId: pregnancy._id,
          userId: user._id,
          createdAt: Date.now(),
        })
      );

      // add error to childs
      await addError(trx, user, pregnancy, childResults);

      console.log('ooooooooooooooooooooooout');
      await trx.commit();

      resolve({ status: 200, result: successAction });
    } catch (error) {
      console.log(error);
      if (error.status) reject(error);
      reject({ status: 500, error: serverError });
    }
  });
};
