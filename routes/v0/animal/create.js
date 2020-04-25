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

import {
  db,
  // logCollection,
  userCollection,
  animalCollection,
  weightCollection,
  fromAnimalToWeight,
  fromAnimalToAnimal,
  expensesCollection,
  fromAnimalToExpenses,
} from '../../../DB/db';

const findUser = decoded => {
  return new Promise(async (resolve, reject) => {
    const user = await userCollection.document(`users/${decoded.key}`);
    if (!user) reject({ status: 401, msg: unauthorized });
    if (user.username !== decoded.username) reject({ status: 401, msg: unauthorized });
    else resolve(user);
  });
};

async function createAnimalObject(animal, decoded) {
  return new Promise((resolve, reject) => {
    if (animal.entryType === 0) {
      const obj = {
        _key: animal.key,
        entryDate: animal.entryDate,
        birthDate: animal.birthDate,
        entryType: animal.entryType,
        type: animal.type,
        race: animal.race,
        sex: animal.sex,
        createdAt: animal.entryDate,
      };
      resolve(obj);
    } else if (animal.entryType === 1) {
      const obj = {
        _key: animal.key,
        entryDate: animal.entryDate,
        birthDate: animal.birthDate,
        entryType: animal.entryType,
        type: animal.type,
        race: animal.race,
        sex: animal.sex,
        createdAt: animal.entryDate,
      };
      resolve(obj);
    } else if (animal.entryType === 2) {
      const obj = {
        _key: animal.key,
        entryDate: animal.entryDate,
        birthDate: animal.birthDate,
        entryType: animal.entryType,
        type: animal.type,
        race: animal.race,
        sex: animal.sex,
        createdAt: animal.entryDate,
      };
      resolve(obj);
    } else {
      reject({ status: 400, error: badRequest });
    }
  });
}

export default data => {
  console.log(data);
  return new Promise(async (resolve, reject) => {
    // TODO: check if mother and father exists
    try {
      const decoded = await jwt.verify(data.token, keys.jwtKey);
      const user = await findUser(decoded);

      if (data.animal.entryType === 0) {
        const fatherExists = await animalCollection.document(`animals/${data.animal.fatherkey}`);
        if (!fatherExists)
          throw new Error({
            status: 400,
            error: badRequest,
            printErrors: [{ father: fatherDosentExists }],
          });
        if (fatherExists.sex !== 0)
          throw new Error({
            status: 400,
            error: badRequest,
            printErrors: [{ father: sexMismatch }],
          });

        const motherExists = await animalCollection.document(`animals/${data.animal.motherKey}`);
        if (!motherExists)
          throw new Error({
            status: 400,
            error: badRequest,
            printErrors: [{ mother: motherDosentExists }],
          });
        if (motherExists.sex !== 0)
          throw new Error({
            status: 400,
            error: badRequest,
            printErrors: [{ mother: sexMismatch }],
          });
      }

      const documentExists = await animalCollection.documentExists(`${data.animal.key}`);
      if (documentExists === true) throw new Error({ status: 401, error: animalWithSameKeyExists });

      // NOTE: filtering fileds to get final object based on entryType
      const animalObject = await createAnimalObject(data.animal, decoded);

      console.log(animalObject);

      const trx = await db.beginTransaction({
        write: [
          'logs',
          'animals',
          'weights',
          'fromAnimalToWeight',
          'fromAnimalToAnimal',
          'expenses',
          'fromAnimalToExpenses',
        ],
      });

      // await trx.run(() =>
      //   logCollection.save({
      //     createdAt: data.animal.date,
      //     userkey: decoded.key,
      //     action: 'PUT-animal',
      //     animalKey: animalObject._key,
      //     entryType: animalObject.entryType,
      //   })
      // );

      const animal = await trx.run(() => animalCollection.save(animalObject));

      const weight = await trx.run(() =>
        weightCollection.save({
          userkey: decoded.key,
          weight: data.animal.weight,
          createdAt: data.animal.entryDate,
        })
      );

      // await trx.run(() =>
      //   logCollection.save({
      //     userkey: decoded.key,
      //     action: 'PUT-weight',
      //     animalKey: animalObject._key,
      //     weightKey: weight._key,
      //     createdAt: data.animal.date,
      //   })
      // );

      await trx.run(() =>
        fromAnimalToWeight.save({
          _from: animal._id,
          _to: weight._id,
        })
      );

      if (data.animal.entryType === 0) {
        // father
        await trx.run(() =>
          fromAnimalToAnimal.save({
            createdAt: data.animal.entryDate,
            type: 'father',
            _from: animal._id,
            _to: `animals/${data.animal.fatherkey}`,
          })
        );
        // mother
        await trx.run(() =>
          fromAnimalToAnimal.save({
            createdAt: data.animal.entryDate,
            type: 'mother',
            _from: animal._id,
            _to: `animals/${data.animal.motherkey}`,
          })
        );
        // childrenOfFather
        await trx.run(() =>
          fromAnimalToAnimal.save({
            createdAt: data.animal.entryDate,
            type: 'children',
            sex: data.animal.sex,
            _from: `animals/${data.animal.fatherkey}`,
            _to: animal._id,
          })
        );
        // childrenOfMother
        await trx.run(() =>
          fromAnimalToAnimal.save({
            createdAt: data.animal.entryDate,
            type: 'children',
            sex: data.animal.sex,
            _from: `animals/${data.animal.motherkey}`,
            _to: animal._id,
          })
        );
      }

      // NOTE: if animal is bought add its price to expenses
      if (data.animal.entryType === 1) {
        // price: animal.price,

        const expense = await trx.run(() =>
          expensesCollection.save({
            value: data.animal.price,
            createdAt: data.animal.entryDate,
            type: 'buy-animal',
          })
        );

        await trx.run(() =>
          fromAnimalToExpenses.save({
            _from: animal._id,
            _to: expense._id,
          })
        );
      }

      await trx.commit();

      resolve({ status: 200, msg: 'دام با موفقیت ایجاد شد' });
    } catch (error) {
      console.log(error);
      if (error.status) reject(error);
      else reject({ status: 500, error: serverError });
    }
  });
};
