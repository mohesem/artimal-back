import { db } from '../../../DB/db';
import objectFromString from '../../../Tools/objectFromString';

// TODO: make it dynamic

export default (limit, page, query) => {
  return new Promise(async (resolve, reject) => {
    try {
      // console.log(`LIMIT ${Number(page) * Number(limit)}, ${Number(page) * Number(limit) + 20}`);
      const obj = query ? await objectFromString(query) : {};

      db.query(
        `
        FOR log IN logView
      ${obj.value ? `FILTER log.value == '${obj.value}'` : ''}
      ${obj.collection ? `FILTER log.type == '${obj.collection}'` : ''}
      ${obj.animalKey ? `SEARCH STARTS_WITH(log.animalId, "animals/${obj.animalKey}")` : ''}
        SORT DATE_TIMESTAMP(log.createdAt) DESC
        LIMIT ${Number(page) * Number(limit)}, 20
        return log
        `
      ).then(docs => {
        resolve({ status: 200, result: docs._result });
      });
    } catch (err) {
      console.log(err);
      reject({ status: 500, msg: 'خطای سرور' });
    }
  });
};
