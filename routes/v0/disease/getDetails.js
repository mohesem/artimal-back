import { db } from '../../../DB/db';
import { serverError, noResult } from '../../errors';

async function search(query) {
  return new Promise((resolve, reject) => {
    db.query(query).then(docs => {
      console.log('resukt is :: ', { docs });

      const result = docs._result;
      resolve(result);
    });
  });
}

const createQuerySingle = key => {
  return new Promise((resolve, reject) => {
    const q = `
    FOR vertex, edge IN OUTBOUND 'diseases/${key}' diseaseEdges
    FILTER edge.value == 'step'
    Filter vertex.deleted != true
    SORT DATE_TIMESTAMP(vertex.date) DESC
    return vertex
    `;
    resolve(q);
    reject();
  });
};

export default key => {
  console.log(`got the req, ${key}`);
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
