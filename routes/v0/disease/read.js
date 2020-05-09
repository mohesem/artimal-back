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

const createQuerySingle = key => {
  console.log({ key });
  return new Promise((resolve, reject) => {
    const q = `
    FOR vertex, edge IN OUTBOUND 'animals/${key}' animalEdges
    FILTER edge.value == 'disease'
    Filter vertex.deleted != true
    return vertex
    `;
    resolve(q);
    reject();
  });
};

export default key => {
  return new Promise(async (resolve, reject) => {
    try {
      const query = await createQuerySingle(key);
      const result = await search(query);
      resolve({ status: 200, result });
    } catch (error) {
      if (error.status) reject(error);
      else reject({ status: 500, error: serverError });
    }
  });
};
