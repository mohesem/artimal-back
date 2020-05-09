import { db } from '../../../DB/db';
import { serverError } from '../../errors';

export default () => {
  return new Promise((resolve, reject) => {
    try {
      db.query(
        `
        FOR animal IN animals
        FILTER animal.deleted != true
        FILTER animal.exit != true
        COLLECT WITH COUNT INTO length
        RETURN length
        `
      )
        .then(docs => {
          const result = docs._result;
          resolve({ status: 200, result });
        })
        .catch(err => {
          throw new Error({ status: 500, error: serverError });
        });
    } catch (error) {
      if (error.status) reject(error);
      else {
        reject({ status: 500, error: serverError });
      }
    }
  });
};
