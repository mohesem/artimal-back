import { db } from '../../../DB/db';
import { serverError, noResult } from '../../errors';

async function search(query) {
  return new Promise((resolve, reject) => {
    db.query(query).then(docs => {
      const result = docs._result;
      resolve(result);
    });
  });
}

const createQuery = key => {
  return new Promise((resolve, reject) => {
    const q = `
    FOR vertex, edge IN OUTBOUND 'animals/${key}' animalEdges
    FILTER edge.value == 'milk'
    FILTER vertex.deleted != true
    RETURN vertex
    `;
    resolve(q);
    reject();
  });
};

export default key => {
  // const { animalKeys } = body;
  // console.log(`got the req, ${animalKeys}`);
  return new Promise(async (resolve, reject) => {
    try {
      const query = await createQuery(key);
      const result = await search(query);
      resolve({ status: 200, result });
    } catch (error) {
      if (error.status) reject(error);
      else reject({ status: 500, error: serverError });
    }
  });
};
