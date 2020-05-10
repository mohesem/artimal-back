import { db } from '../../../DB/db';

// TODO: make it dynamic

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

const createQuery = (limit, key, sex, type, entryType) => {
  // TODO: add it later ==>  FILTER animal.exit != true

  // ${race ? `FILTER animal.race == "${race}"` : ''}

  console.log('___---___---_', typeof type, type);

  return new Promise((resolve, reject) => {
    const q = `FOR animal IN animalView
    SEARCH STARTS_WITH(animal._key, "${key}")
    ${sex !== '_' ? `FILTER animal.sex == ${sex}` : ''}
    ${type !== '_' ? `FILTER animal.type == "${type}"` : ''}
    ${entryType !== '_' ? `FILTER animal.entryType == "${entryType}"` : ''}
    ${limit ? `LIMIT ${limit}` : ''}
    RETURN animal`;
    console.log(q);
    resolve(q);
    reject();
  });
};

export default (limit, key, sex, type, entryType) => {
  return new Promise(async (resolve, reject) => {
    const query = await createQuery(limit, key, sex, type, entryType);
    // console.log('........', query);
    try {
      const result = await search(query);
      console.log('..........', result);
      resolve({ status: 200, result });
    } catch (err) {
      console.log(err);
      reject({ status: 500, msg: 'خطای سرور' });
    }
  });
};
