import { db } from '../../../DB/db';
import keys from '../../../config/keys';
import { wrongPassword, wrongUsername, serverError } from '../../errors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

async function findUser(username) {
  return new Promise((resolve, reject) => {
    db.query(
      `FOR user IN users
    FILTER user.username == "${username}"
    RETURN user`
    )
      .then(docs => {
        const result = docs._result;
        if (!result.length) reject({ status: 401, error: wrongUsername });
        else resolve(result[0]);
      })
      .catch(error => {
        reject({ status: 500, error: serverError });
      });
  });
}

async function comparePassword(user, password) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password + keys.passwordKey, user.password, (err, isEqual) => {
      if (err) reject({ status: 500, error: serverError });
      if (!isEqual) reject({ status: 401, error: wrongPassword });
      else resolve();
    });
  });
}

async function createNewToken(user) {
  return new Promise((resolve, reject) => {
    jwt.sign({ key: user._key, username: user.username }, keys.jwtKey, (err, token) => {
      if (err) reject({ status: 500, error: serverError });
      else resolve(token);
    });
  });
}

export default body => {
  const { username, password } = body;
  return new Promise(async (resolve, reject) => {
    try {
      const user = await findUser(username);
      await comparePassword(user, password);
      const token = await createNewToken(user);
      resolve({ status: 200, token });
    } catch (error) {
      if (error.status) reject(error);
      else reject({ status: 500, error: serverError });
    }
  });
};

// TODO: check error messages for appropriate messages

//   db.query(
//     `FOR user IN users
//   FILTER user.username == "${usernamew}"
//   RETURN user`
//   )
//     .then(docs => {
//       const result = docs._result;
//       if (!result.length) {
//         reject({ status: 401, error: wrongUsername });
//       } else {
//         console.log('.....result', result);
//         const user = result[0];
//         bcrypt.compare(password + keys.passwordKey, user.password, (err, isEqual) => {
//           if (err) console.log(err);
//           console.log(isEqual);
//           if (!isEqual) {
//             reject({ status: 401, error: wrongPassword });
//           }
//           //
//           jwt.sign({ key: user._key, username: user.username }, keys.jwtKey, (err, token) => {
//             if (err) reject({ status: 500, error: serverError });
//             else resolve(token);
//           });
//         });
//       }
//     })
//     .catch(function(error) {
//       reject(error.response.body);
//     });
