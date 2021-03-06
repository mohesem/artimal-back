import { Animals, db } from '../../../DB/db';
import { serverError } from '../../errors';

async function search(key) {
  console.log(key);
  return new Promise(async (resolve, reject) => {
    try {
      const animal = await Animals.document(key);
      console.log(animal);
      resolve(animal);
    } catch (error) {
      console.log(error);
      reject({ status: 500, error: serverError });
    }
  });
}

export default key => {
  console.log('get details :: ', key);
  return new Promise(async (resolve, reject) => {
    try {
      const details = await search(key);

      resolve({ status: 200, details });
    } catch (error) {
      if (error.status) reject(error);
      reject({ status: 500, error: serverError });
    }
  });
};
