/* -------------------------------------------------------------------------- */
/*                               create new user                              */
/* -------------------------------------------------------------------------- */
bcrypt.hash('admin' + keys.passwordKey, keys.passwordSalt, async (err, hash) => {
  if (err) reject({ msg: 'internal server error' });
  const saveUser = await userCollection.save({
    username: 'admin',
    password: hash,
  });
});

/* -------------------------------------------------------------------------- */
/*                           get edges of a document                          */
/* -------------------------------------------------------------------------- */
// FOR c IN animals
//     FOR v IN 1..1 OUTBOUND c animalRecords
//         RETURN {v, c}

/* -------------------------------------------------------------------------- */
/*                          get document from an edge                         */
/* -------------------------------------------------------------------------- */
// FOR r IN records
//     FOR a IN 1..1 INBOUND r animalRecords
//     return {r, a}
