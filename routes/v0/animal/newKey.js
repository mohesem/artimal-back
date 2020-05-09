import { Animals } from '../../../DB/db';

export default () => {
  return new Promise(async (resolve, reject) => {
    const result = await Animals.count();
    if (result.error) {
      reject({ status: 500, error: 'خطای سرور' });
    } else {
      resolve({ status: 200, result: result.count + 1 });
    }
  });
};
