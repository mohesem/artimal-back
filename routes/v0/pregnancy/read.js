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
    FOR animal IN animals
    FILTER animal._key == '${key}'
    FOR pregnancy IN 1..1 OUTBOUND animal fromAnimalToPregnancy
    FOR male IN 1..1 INBOUND pregnancy fromAnimalToPregnancy
    FILTER pregnancy.deleted == false
    FILTER male.sex == 0
    SORT DATE_TIMESTAMP(pregnancy.startedAt) ASC
    RETURN {pregnancy, male}
    `;
    resolve(q);
    reject();
  });
};

export default body => {
  const { key } = body.entry;
  return new Promise(async (resolve, reject) => {
    try {
      const query = await createQuery(key);
      const result = await search(query);
      console.log('result is ::: ', result);
      resolve({ status: 200, result });
    } catch (error) {
      if (error.status) reject(error);
      else reject({ status: 500, error: serverError });
    }
  });
};
