import { Animals, db } from '../../../DB/db';
import { serverError } from '../../errors';

async function search(key) {
  console.log('::::::::::', key);
  return new Promise(async (resolve, reject) => {
    try {
      const pregnancies = await db.query(
        `
        FOR pregnancy, edge IN OUTBOUND 'animals/${key}' animalEdges
        FILTER edge.value == 'pregnancy'
        FOR animal IN INBOUND pregnancy._id animalEdges
        FILTER animal.sex == 0
        SORT DATE_TIMESTAMP(pregnancy.startedAt) DESC
        RETURN {pregnancy, male: animal}
        `
      );

      console.log(pregnancies._result);
      resolve(pregnancies._result);
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
      const result = await search(key);
      console.log('result is :: ', result);
      resolve({ status: 200, result });
    } catch (error) {
      if (error.status) reject(error);
      reject({ status: 500, error: serverError });
    }
  });
};
