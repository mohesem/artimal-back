import { db } from '../../../DB/db';

// TODO: make it dynamic

export default (limit, page, collection, value) => {
  console.log('__+++++____----__-=++ ', { value });
  return new Promise(async (resolve, reject) => {
    try {
      db.query(
        `
        FOR log IN logs
      ${value !== 'null' ? `FILTER log.value == '${value}'` : ''}
      ${collection !== 'null' ? `FILTER log.type == '${collection}'` : ''}
        SORT DATE_TIMESTAMP(log.createdAt) DESC
        LIMIT ${Number(page) * Number(limit)}, ${Number(page + 1) * Number(limit)}
        return log
        `
      ).then(docs => {
        // console.log(docs._result);
        resolve({ status: 200, result: docs._result });
      });
    } catch (err) {
      console.log(err);
      reject({ status: 500, msg: 'خطای سرور' });
    }
  });
};
