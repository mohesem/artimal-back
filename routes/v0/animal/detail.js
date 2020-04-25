import { animalCollection, db } from '../../../DB/db';
import { serverError } from '../../errors';

async function search(key) {
  console.log(key);
  return new Promise(async (resolve, reject) => {
    try {
      const animal = await animalCollection.document(`animals/${key}`);
      console.log(animal);
      resolve(animal);
    } catch (error) {
      console.log(error);
      reject({ status: 500, error: serverError });
    }
  });
}

async function getWeights(key) {
  return new Promise((resolve, reject) => {
    db.query(
      `
      FOR a IN animals
      FILTER a._key == "${key}"
      FOR w IN 1..1 OUTBOUND a fromAnimalToWeight
      SORT DATE_TIMESTAMP(w.createdAt) DESC
      RETURN w
      `
    ).then(docs => {
      const result = docs._result;
      const formatResult = result.map(r => {
        return { key: r._key, type: r.type, race: r.race };
      });
      if (result.length) {
        console.log(docs._result);
        resolve(formatResult);
      } else {
        resolve({ results: [] });
      }
    });
  });
}

export default key => {
  console.log('get details :: ', key);
  return new Promise(async (resolve, reject) => {
    try {
      const details = await search(key);
      const weights = await getWeights(key);
      resolve({ status: 200, details, weights });
    } catch (error) {
      if (error.status) reject(error);
      reject({ status: 500, error: serverError });
    }
  });
};
