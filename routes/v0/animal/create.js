// import db from '../../DB/db';
import jwt from 'jsonwebtoken';
import keys from '../../../config/keys';
import {
  unauthorized,
  animalWithSameKeyExists,
  badRequest,
  serverError,
  fatherDosentExists,
  motherDosentExists,
  sexMismatch,
} from '../../errors';

import { db, Logs, Users, Animals, Weights, Expenses, AnimalEdges } from '../../../DB/db';

const findUser = decoded => {
  return new Promise(async (resolve, reject) => {
    const user = await Users.document(`users/${decoded.key}`);
    if (!user) reject({ status: 401, msg: unauthorized });
    if (user.username !== decoded.username) reject({ status: 401, msg: unauthorized });
    else resolve(user);
  });
};

async function createAnimalObject(animal, decoded) {
  console.log('animal is :: ', animal);
  return new Promise((resolve, reject) => {
    // general entries validation

    if (!animal.weight) reject({ status: 400, error: badRequest });
    console.log(!animal.weight, 2);

    if (!animal.type) reject({ status: 400, error: badRequest });
    if (!animal.key) reject({ status: 400, error: badRequest });
    if (!animal.entryDate) reject({ status: 400, error: badRequest });
    if (!animal.birthDate) reject({ status: 400, error: badRequest });
    if (animal.type !== 'گاو' && !animal.race) reject({ status: 400, error: badRequest });
    if (typeof animal.sex !== 'number') reject({ status: 400, error: badRequest });
    if (animal.type === 'گوسفند' && !animal.gene) reject({ status: 400, error: badRequest });

    if (animal.entryType === 1 && !animal.price) reject({ status: 400, error: badRequest });

    if (animal.entryType === 0 && (!animal.fatherKey || !animal.motherKey)) {
      reject({ status: 400, error: badRequest });
    }

    if (animal.entryType === 0) {
      const obj = {
        _key: animal.key,
        birthDate: animal.birthDate,
        entryType: animal.entryType,
        type: animal.type,
        race: animal.race,
        sex: animal.sex,
        createdAt: Date.now(),
        gene: animal.type === 'گوسفند' ? animal.gene : undefined,
      };
      resolve(obj);
    } else if (animal.entryType === 1) {
      const obj = {
        _key: animal.key,
        birthDate: animal.birthDate,
        entryType: animal.entryType,
        type: animal.type,
        race: animal.race,
        sex: animal.sex,
        createdAt: Date.now(),
        gene: animal.type === 'گوسفند' ? animal.gene : undefined,
      };
      resolve(obj);
    } else if (animal.entryType === 2) {
      const obj = {
        _key: animal.key,
        birthDate: animal.birthDate,
        entryType: animal.entryType,
        type: animal.type,
        race: animal.race,
        sex: animal.sex,
        createdAt: Date.now(),
        gene: animal.type === 'گوسفند' ? animal.gene : undefined,
        exit: false,
      };
      console.log(obj);
      resolve(obj);
    } else {
      reject({ status: 400, error: badRequest });
    }
  });
}

export default data => {
  console.log('...............................................', data);
  return new Promise(async (resolve, reject) => {
    try {
      // check user
      const decoded = await jwt.verify(data.token, keys.jwtKey);
      const user = await findUser(decoded);

      // check if any animal exists with same key
      const documentExists = await Animals.documentExists(`${data.animal.key}`);
      if (documentExists === true) throw { status: 401, error: animalWithSameKeyExists };

      // creating animal object and validating request entries based on entryType
      const animalObject = await createAnimalObject(data.animal, decoded);

      // console.log(animalObject);

      // console.log('starting db transaction');

      const trx = await db.beginTransaction({
        write: ['logs', 'animals', 'weights', 'expenses', 'animalEdges'],
      });

      const animal = await trx.run(() => Animals.save(animalObject));

      const weight = await trx.run(() =>
        Weights.save({
          value:
            typeof data.animal.weight === 'number'
              ? data.animal.weight
              : Number(data.animal.weight),
          createdAt: Date.now(),
          date: data.animal.entryDate,
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
        Logs.save({
          value: 'create',
          type: 'animal',
          entryId: animal._id,
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

      if (data.animal.entryType === 1) {
        const expense = await trx.run(() =>
          Expenses.save({
            value:
              typeof data.animal.price === 'number' ? data.animal.price : Number(data.animal.price),
            createdAt: Date.now(),
            date: data.animal.entryDate,
            type: 'buy-animal',
          })
        );

        await trx.run(() =>
          AnimalEdges.save({
            value: 'expense',
            _from: animal._id,
            _to: expense._id,
          })
        );

        await trx.run(() =>
          Logs.save({
            value: 'create',
            type: 'expense',
            entryId: expense._id,
            userId: user._id,
            createdAt: Date.now(),
          })
        );
      }

      // if (data.animal.entryType === 0) {
      //   // father
      //   await trx.run(() =>
      //     fromAnimalToAnimal.save({
      //       createdAt: Date.now(),
      //       type: 'father',
      //       _from: animal._id,
      //       _to: `animals/${data.animal.fatherkey}`,
      //     })
      //   );
      //   // mother
      //   await trx.run(() =>
      //     fromAnimalToAnimal.save({
      //       createdAt: Date.now(),
      //       type: 'mother',
      //       _from: animal._id,
      //       _to: `animals/${data.animal.motherkey}`,
      //     })
      //   );
      //   // childrenOfFather
      //   await trx.run(() =>
      //     fromAnimalToAnimal.save({
      //       createdAt: Date.now(),
      //       type: 'children',
      //       sex: data.animal.sex,
      //       _from: `animals/${data.animal.fatherkey}`,
      //       _to: animal._id,
      //     })
      //   );
      //   // childrenOfMother
      //   await trx.run(() =>
      //     fromAnimalToAnimal.save({
      //       createdAt: Date.now(),
      //       type: 'children',
      //       sex: data.animal.sex,
      //       _from: `animals/${data.animal.motherkey}`,
      //       _to: animal._id,
      //     })
      //   );
      // }

      // // NOTE: if animal is bought add its price to expenses

      await trx.commit();

      resolve({ status: 200, result: 'دام با موفقیت ایجاد شد' });
    } catch (error) {
      console.log(error);
      if (error.status) reject(error);
      else reject({ status: 500, error: serverError });
    }
  });
};

// if (data.animal.entryType === 0) {
//   const fatherExists = await Animals.document(`animals/${data.animal.fatherkey}`);
//   if (!fatherExists)
//     throw new Error({
//       status: 400,
//       error: badRequest,
//       printErrors: [{ father: fatherDosentExists }],
//     });
//   if (fatherExists.sex !== 0)
//     throw new Error({
//       status: 400,
//       error: badRequest,
//       printErrors: [{ father: sexMismatch }],
//     });

//   const motherExists = await Animals.document(`animals/${data.animal.motherKey}`);
//   if (!motherExists)
//     throw new Error({
//       status: 400,
//       error: badRequest,
//       printErrors: [{ mother: motherDosentExists }],
//     });
//   if (motherExists.sex !== 0)
//     throw new Error({
//       status: 400,
//       error: badRequest,
//       printErrors: [{ mother: sexMismatch }],
//     });
// }
