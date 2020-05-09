import { Users } from '../../../DB/db';
import keys from '../../../config/keys';
import jwt from 'jsonwebtoken';
import { serverError, wrongToken } from '../../errors';

export default token => {
  return new Promise(async (resolve, reject) => {
    try {
      const decoded = await jwt.verify(token, keys.jwtKey);
      const user = await Users.document(`users/${decoded.key}`);
      if (!user) throw new Error({ status: 400, error: wrongToken });
      if (user.username === decoded.username) {
        resolve({ status: 200, result: { role: user.role } });
      } else {
        reject({ status: 400, error: wrongToken });
      }
    } catch (error) {
      console.log('getUserByToken error ::: ', error);
      if (error.status) reject(error);
      else reject({ status: 500, error: serverError });
    }
  });
};
