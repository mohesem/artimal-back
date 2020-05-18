import { db } from '../../../DB/db';

async function search(query) {
  return new Promise((resolve, reject) => {
    db.query(
      `
            FOR animal IN animals
            FILTER animal.exit != true
            COLLECT type = animal.type, race = animal.race WITH COUNT INTO countType
            return {race, type, countType }
          `
    ).then(docs => {
      const result = docs._result;
      resolve(result);
    });
  });
}

export default () => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await search();
      console.log({ result });
      resolve({ status: 200, result });
    } catch (error) {
      if (error.status) reject(error);
      else reject({ status: 500, error: serverError });
    }
  });
};
