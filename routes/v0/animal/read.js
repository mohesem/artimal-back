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
        resolve({ results: [] });
      }
    });
  });
}

const createQuery = (key, sex, type, limit) => {
  return new Promise((resolve, reject) => {
    const q = `FOR animal IN animalView
    SEARCH STARTS_WITH(animal._key, "${key}")
    ${sex !== undefined ? `FILTER animal.sex == ${sex}` : ''}
    ${type ? `FILTER animal.type == "${type}"` : ''}
    ${limit ? `LIMIT ${limit}` : ''}
    RETURN animal`;
    resolve(q);
    reject();
  });
};

export default body => {
  const { key, sex, type, limit } = body;
  return new Promise(async (resolve, reject) => {
    const query = await createQuery(key, sex, type, limit);
    console.log('........', query);
    try {
      const results = await search(query);
      console.log('..........', results);
      resolve({ status: 200, results });
    } catch (err) {
      console.log(err);
      reject({ status: 500, msg: 'خطای سرور' });
    }
  });
};
