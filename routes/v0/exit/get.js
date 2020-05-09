import { db } from '../../../DB/db';
import { serverError, noResult } from '../../errors';

async function search(query) {
  return new Promise((resolve, reject) => {
    db.query(query).then(docs => {
      const result = docs._result;
      resolve(result);
      reject();
      // else {
      //   reject({ status: 404, error: noResult });
      // }
    });
  });
}

const createQuery = key => {
  // TODO: add childrens
  return new Promise((resolve, reject) => {
    const q = `
    FOR vertex, edge IN OUTBOUND 'animals/${key}' animalEdges
    FILTER edge.value == 'exit'
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
      const query = await createQuery(key);
      const result = await search(query);
      console.log('result is ::: ', result);
      resolve({ status: 200, result: result[0] });
    } catch (error) {
      if (error.status) reject(error);
      else reject({ status: 500, error: serverError });
    }
  });
};
