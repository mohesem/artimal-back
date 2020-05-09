import { db } from '../../../DB/db';
import { serverError, noResult } from '../../errors';

async function search(query) {
  return new Promise((resolve, reject) => {
    db.query(query).then(docs => {
      console.log('***************', docs);
      const result = docs._result;
      if (result.length) {
        resolve(result);
      } else {
        reject({ status: 404, error: noResult });
      }
    });
  });
}

const createQuery = key => {
  // TODO: add childrens
  return new Promise((resolve, reject) => {
    const q = `
    FOR edge IN pregnancy
    FILTER edge._key == '${key}'
    FOR parent IN 1..1 INBOUND edge fromAnimalToPregnancy
    RETURN {parent}
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
