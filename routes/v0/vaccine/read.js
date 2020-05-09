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
  return new Promise((resolve, reject) => {
    const q = `
    FOR animal IN animals
    FILTER animal._key == '${key}'
    FOR vaccine IN 1..1 OUTBOUND animal fromAnimalToVaccine
    FILTER vaccine.deleted != true
    SORT DATE_TIMESTAMP(vaccine.createdAt) ASC
    RETURN {vaccine}
    `;
    resolve(q);
    reject();
  });
};

export default body => {
  const { keys } = body.entry;
  console.log(`got the req, ${keys}`);
  return new Promise(async (resolve, reject) => {
    if (keys.length === 1) {
      try {
        const query = await createQuerySingle(keys[0]);
        const result = await search(query);
        resolve({ status: 200, result });
      } catch (error) {
        if (error.status) reject(error);
        else reject({ status: 500, error: serverError });
      }
    }
  });
};
