import { db } from '../../../DB/db';
import objectFromString from '../../../Tools/objectFromString';

async function search(query) {
  return new Promise((resolve, reject) => {
    db.query(query).then(docs => {
      const result = docs._result;
      const formatResult = result.map(r => {
        return { key: r._key, type: r.type, race: r.race };
      });
      if (result.length) {
        console.log(docs._result);
        resolve(formatResult);
      } else {
        resolve({ result: [] });
      }
    });
  });
}

const createQuery = obj => {
  // TODO: add it later ==>  FILTER animal.exit != true

  // ${race ? `FILTER animal.race == "${race}"` : ''}

  // console.log('___---___---_', typeof type, type);

  return new Promise((resolve, reject) => {
    const q = `FOR animal IN animalView
    SEARCH STARTS_WITH(animal._key, "${obj.key}")
    ${obj.sex ? `FILTER animal.sex == ${obj.sex}` : ''}
    ${obj.type ? `FILTER animal.type == "${obj.type}"` : ''}
    ${obj.entryType ? `FILTER animal.entryType == "${obj.entryType}"` : ''}
    ${obj.race ? `FILTER animal.race == "${obj.race}"` : ''}
    ${obj.limit ? `LIMIT ${obj.limit}` : ''}
    RETURN animal`;
    console.log(q);
    resolve(q);
    reject();
  });
};

export default string => {
  console.log(string);

  return new Promise(async (resolve, reject) => {
    const obj = await objectFromString(string);
    const query = await createQuery(obj);
    try {
      const result = await search(query);
      resolve({ status: 200, result });
    } catch (err) {
      console.log(err);
      reject({ status: 500, msg: 'خطای سرور' });
    }
  });
};
