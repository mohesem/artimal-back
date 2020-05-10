import { db, Users, Logs } from '../../../DB/db';
import jwt from 'jsonwebtoken';
import keys from '../../../config/keys';
import bcrypt from 'bcryptjs';

import { serverError, successAction, wrongToken } from '../../errors';

const findUser = decoded => {
  return new Promise(async (resolve, reject) => {
    const user = await Users.document(decoded.key);
    if (user) {
      resolve(user);
    } else {
      reject({ status: 400, error: wrongToken });
    }
  });
};

const createHash = password => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password + keys.passwordKey, keys.passwordSalt, async (err, hash) => {
      if (err) reject({ error: 'internal server error' });
      resolve(hash);
    });
  });
};

export default data => {
  console.log(data);
  return new Promise(async (resolve, reject) => {
    try {
      const decoded = await jwt.verify(data.token, keys.jwtKey);
      console.log({ decoded });

      const user = await findUser(decoded);

      const trx = await db.beginTransaction({
        read: ['users'],
        write: ['users', 'logs'],
      });

      const isUserNameNew = await trx.run(() =>
        db.query(`
        FOR user IN users
          FILTER user.username == '${data.entry.username}'
          RETURN user
        `)
      );
      if (isUserNameNew._result.length)
        throw { status: 400, error: { username: 'نام کاربری تکراری است' } };

      const hash = await createHash(data.entry.password);

      // username: 'admin',
      //   password: hash,
      //   role: 'admin',

      console.log({ hash });
      const newUser = await trx.run(() =>
        Users.save({
          username: data.entry.username,
          password: hash,
          role: data.entry.role === 1 ? 'admin' : 'user',
        })
      );

      await trx.run(() =>
        Logs.save({
          value: 'create',
          type: 'user',
          entryId: newUser._id,
          userId: user._id,
          createdAt: Date.now(),
        })
      );

      console.log({ newUser });
      await trx.commit();
      resolve({ status: 200, result: successAction });
    } catch (error) {
      console.log(error);
      if (error.status) reject(error);
      reject({ status: 500, error: serverError });
    }
  });
};
