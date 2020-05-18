import { db } from '../../../DB/db';
import { serverError, noResult } from '../../errors';

async function search(query) {
  return new Promise((resolve, reject) => {
    db.query(query).then(docs => {
      // console.log('***************', docs);
      const result = docs._result;
      resolve(result);
    });
  });
}

const createQuery = key => {
  // TODO: add childrens
  return new Promise((resolve, reject) => {
    const q = `
      FOR vertex, edge IN OUTBOUND 'pregnancies/${key}' pregnancyEdges
      RETURN vertex
    `;
    resolve(q);
    reject();
  });
};

const addBirthWeightToChilds = array => {
  return new Promise(async (resolve, reject) => {
    const finalResult = [];

    array.forEach(async (c, i) => {
      const q = `
        FOR vertex , edge IN OUTBOUND '${c._id}' animalEdges
        FILTER edge.value == 'weight'
        SORT DATE_TIMESTAMP(vertex.date) ASC
        LIMIT 1
        RETURN vertex
      `;

      console.log(q);

      const weight = await search(q);

      console.log({ weight });
      finalResult.push({ ...c, weight: weight[0] });
      if (i == array.length - 1) resolve(finalResult);
    });
  });
};

export default key => {
  return new Promise(async (resolve, reject) => {
    try {
      const query = await createQuery(key);
      const result = await search(query);
      const finalResult = await addBirthWeightToChilds(result);

      console.log('result is ::: ', finalResult);
      resolve({ status: 200, result: finalResult });
    } catch (error) {
      if (error.status) reject(error);
      else reject({ status: 500, error: serverError });
    }
  });
};
