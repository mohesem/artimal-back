import { animalCollection } from '../../../DB/db';

export default () => {
  return new Promise(async (resolve, reject) => {
    const result = await animalCollection.count();
    if (result.error) {
      reject({ status: 500, error: 'خطای سرور' });
    } else {
      console.log(result.count);
      resolve({ status: 200, count: result.count + 1 });
    }
  });
};
