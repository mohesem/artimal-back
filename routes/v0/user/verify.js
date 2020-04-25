import { userCollection } from '../../../DB/db';
import keys from '../../../config/keys';
import jwt from 'jsonwebtoken';
import { serverError, wrongToken } from '../../errors';

export default body => {
  const { token } = body;
  return new Promise(async (resolve, reject) => {
    try {
      const decoded = await jwt.verify(token, keys.jwtKey);
      const user = await userCollection.document(`users/${decoded.key}`);
      console.log('user is : ', user);
      if (!user) throw new Error({ status: 400, error: wrongToken });
      if (user.username === decoded.username) {
        resolve({ status: 200, msg: 'ok' });
      } else {
        reject({ status: 400, error: wrongToken });
      }
    } catch (error) {
      if (error.status) reject(error);
      else reject({ status: 500, error: serverError });
    }

    // db.query(
    //   `FOR user IN users
    // FILTER user._key == "${decoded.key}"
    // RETURN user`
    // ).then(docs => {
    //   const result = docs._result;
    //   if (!result.length) {
    //     reject();
    //   } else {
    //     if (result[0].username === decoded.username) {
    //       resolve();
    //     } else {
    //       reject();
    //     }
    //   }
    // });
  });
};
