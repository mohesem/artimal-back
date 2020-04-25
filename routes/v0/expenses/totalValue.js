import { db } from '../../../DB/db';
import { serverError, noResult } from '../../errors';

async function search(query) {
  return new Promise((resolve, reject) => {
    db.query(query).then(docs => {
      const result = docs._result;
      if (result.length) {
        resolve(result);
      } else {
        reject({ status: 404, error: noResult });
      }
    });
  });
}

const createQuery = (from, to) => {
  return new Promise((resolve, reject) => {
    const q = `FOR expense IN expenses
    FILTER DATE_TIMESTAMP(expense.createdAt) >= DATE_TIMESTAMP('${from}') && DATE_TIMESTAMP(expense.createdAt) <= DATE_TIMESTAMP('${to}')
    COLLECT AGGREGATE v = SUM(expense.value)
    RETURN v`;
    resolve(q);
    reject();
  });
};

export default body => {
  const { from, to } = body;
  console.log(`got the req, from : ${from} , to : ${to}`);
  return new Promise(async (resolve, reject) => {
    const query = await createQuery(from, to);
    console.log('........', query);
    try {
      const result = await search(query);
      console.log('..........', result);
      resolve({ status: 200, result });
    } catch (err) {
      if (err.status) reject(err);
      else reject({ status: 500, msg: serverError });
    }
  });
};
