import {
  db,
  Users,
  Animals,
  Exits,
  AnimalEdges,
  Diseases,
  DiseaseSteps,
  DiseaseEdges,
  ExitEdges,
  Logs,
} from '../../../DB/db';
import jwt from 'jsonwebtoken';
import keys from '../../../config/keys';

import { animalNotFound, serverError, successAction, wrongToken } from '../../errors';
import { Database } from 'arangojs';

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
      const user = await findUser(decoded);

      const trx = await db.beginTransaction({
        write: [
          'animals',
          'exits',
          'animalEdges',
          'diseases',
          'diseaseSteps',
          'exitEdges',
          'diseaseEdges',
          'logs',
        ],
      });

      const animal = await Animals.document(data.entry.key);
      if (animal.out) {
        console.log('**************');
        throw {
          status: 400,
          error: 'امکان ثبت مرگ برای دامی که از لیست دام های موجود خارج شده است وجود  ندارد',
        };
      }

      await trx.run(() =>
        Animals.update(animal, {
          exit: true,
        })
      );

      const exit = await trx.run(() =>
        Exits.save({
          type: 'death',
          reason: data.entry.reason,
          disease: data.entry.reason === 'بیماری' ? data.entry.disease.value : undefined,
          date: data.entry.date,
          createdAt: Date.now(),
          comment: data.entry.comment,
        })
      );

      await trx.run(() =>
        AnimalEdges.save({
          value: 'exit',
          _from: animal._id,
          _to: exit._id,
        })
      );

      const activeDisease = await trx.run(() =>
        db.query(
          `
          FOR vertex, edge IN OUTBOUND 'animals/${data.entry.key}' animalEdges
          FILTER edge.value == 'disease'
          FILTER vertex.deleted != true
          FILTER vertex.active == true
          RETURN vertex
          `
        )
      );

      // console.log(activeDisease);

      activeDisease._result.forEach(async d => {
        await trx.run(() => Diseases.update(d, { active: false }));
        await trx.run(() =>
          Logs.save({
            value: 'update',
            type: 'disease',
            from: {
              active: true,
            },
            to: {
              active: false,
            },
            entryId: exit._id,
            userId: user._id,
            createdAt: Date.now(),
          })
        );
      });

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
          type: 'exit',
          entryId: exit._id,
          userId: user._id,
          createdAt: Date.now(),
        })
      );

      if (data.entry.reason === 'بیماری') {
        console.log('##############################################################');
        const newDiseaseStep = await trx.run(() =>
          DiseaseSteps.save({
            drugs: data.entry.drugs,
            effects: data.entry.effects,
            treatment: data.entry.treatment,
            comment: data.entry.comment,
            isCured: data.entry.isCured,
            date: data.entry.date,
            createdAt: Date.now(),
            died: true,
          })
        );
        await trx.run(() =>
          DiseaseEdges.save({
            value: 'step',
            _from: data.entry.disease._id,
            _to: newDiseaseStep._id,
          })
        );

        await trx.run(() =>
          ExitEdges.save({
            value: 'disease',
            _from: exit._id,
            _to: data.entry.disease._id,
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
