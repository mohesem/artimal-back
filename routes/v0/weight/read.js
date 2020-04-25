import { db } from '../../../DB/db';
import { serverError, noResult } from '../../errors';

async function search(query) {
  return new Promise((resolve, reject) => {
    db.query(query).then(docs => {
      console.log('????????????', docs);
      const result = docs._result;
      if (result.length) {
        resolve(result);
      } else {
        reject({ status: 404, error: noResult });
      }
    });
  });
}

const createQuerySingle = key => {
  return new Promise((resolve, reject) => {
    const q = `
    FOR animal IN animals
    FILTER animal._key == '${key}'
    FOR weight IN 1..1 OUTBOUND animal fromAnimalToWeight
    SORT DATE_TIMESTAMP(weight.createdAt) ASC
    RETURN weight
    `;
    resolve(q);
    reject();
  });
};

export default body => {
  const { animalKeys } = body;
  console.log(`got the req, ${animalKeys}`);
  return new Promise(async (resolve, reject) => {
    if (animalKeys.length === 1) {
      try {
        const query = await createQuerySingle(animalKeys[0]);
        console.log('query is', query);
        const result = await search(query);
        resolve({ status: 200, result });
      } catch (error) {
        if (error.status) reject(error);
        else reject({ status: 500, error: serverError });
      }
    }
    // const query = await createQuery(from, to);
    // console.log('........', query);
    // try {
    //   const results = await search(query);
    //   console.log('..........', results);
    //   resolve({ status: 200, results });
    // } catch (err) {
    //   if (err.status) reject(err);
    //   else reject({ status: 500, msg: serverError });
    // }
  });
};
