import debug from 'debug';
const log = debug('app:DB:createCollection');

/* -------------------------------------------------------------------------- */
/*                              animals collection                              */
/* -------------------------------------------------------------------------- */
async function createAnimalsCollection(db) {
  const animalsCollection = await db.collection('animals');
  const result = await animalsCollection.exists();
  if (!result) {
    animalsCollection.create().then(
      () => {
        log('animals Collection created');
      },
      err => {
        throw new Error({ msg: 'Failed to create collection:', err });
      }
    );
  } else {
    log('animals collection already exists');
  }
}

async function createUsersCollection(db) {
  const usersCollection = await db.collection('users');
  const result = await usersCollection.exists();
  if (!result) {
    usersCollection.create().then(
      () => {
        log('users collection created');
      },
      err => {
        throw new Error({ msg: 'Failed to create collection', err });
      }
    );
  } else {
    log('users collection already exists');
  }
}

async function createLogsCollection(db) {
  const logsCollection = await db.collection('logs');
  const result = await logsCollection.exists();
  if (!result) {
    logsCollection.create().then(
      () => {
        log('logs collection created');
      },
      err => {
        throw new Error({ msg: 'Failed to create collection', err });
      }
    );
  } else {
    log('logs collection already exists');
  }
}

// async function createRecordsCollection(db) {
//   const recordsCollection = await db.collection('records');
//   const result = await recordsCollection.exists();
//   if (!result) {
//     recordsCollection.create().then(
//       () => {
//         log('records collection created');
//       },
//       err => {
//         throw new Error({ msg: 'Failed to create collection', err });
//       }
//     );
//   } else {
//     log('records collection already exists');
//   }
// }

async function createWeightsCollection(db) {
  const weightsCollection = await db.collection('weights');
  const result = await weightsCollection.exists();
  if (!result) {
    weightsCollection.create().then(
      () => {
        log('weights collection created');
      },
      err => {
        throw new Error({ msg: 'Failed to create collection', err });
      }
    );
  } else {
    log('weights collection already exists');
  }
}

async function createExpensesCollection(db) {
  const expensesCollection = await db.collection('expenses');
  const result = await expensesCollection.exists();
  if (!result) {
    expensesCollection.create().then(
      () => {
        log('expenses collection created');
      },
      err => {
        throw new Error({ msg: 'Failed to create collection', err });
      }
    );
  } else {
    log('expenses collection already exists');
  }
}

async function createVaccineCollection(db) {
  const vaccineCollection = await db.collection('vaccine');
  const result = await vaccineCollection.exists();
  if (!result) {
    vaccineCollection.create().then(
      () => {
        log('vaccine collection created');
      },
      err => {
        throw new Error({ msg: 'Failed to create collection', err });
      }
    );
  } else {
    log('vaccine collection already exists');
  }
}

async function createDiseaseCollection(db) {
  const diseaseCollection = await db.collection('disease');
  const result = await diseaseCollection.exists();
  if (!result) {
    diseaseCollection.create().then(
      () => {
        log('disease collection created');
      },
      err => {
        throw new Error({ msg: 'Failed to create collection', err });
      }
    );
  } else {
    log('disease collection already exists');
  }
}

/* -------------------------------------------------------------------------- */
/*                                    edges                                   */
/* -------------------------------------------------------------------------- */
// async function createAnimalRecodEdge(db) {
//   const animalRecordsEdge = await db.edgeCollection('animalRecords');
//   const result = await animalRecordsEdge.exists();
//   console.log('.......', result);
//   if (!result) {
//     animalRecordsEdge.create().then(
//       () => {
//         log('animalRecord edgeCollection created');
//       },
//       err => {
//         throw new Error({ msg: 'Failed to create edgeCollection', err });
//       }
//     );
//   } else {
//     log('animalRecord edgeCollection already exists');
//   }
// }

async function createFromAnimalToAnimalEdge(db) {
  const animalAnimalEdge = await db.edgeCollection('fromAnimalToAnimal');
  const result = await animalAnimalEdge.exists();
  console.log('.......', result);
  if (!result) {
    animalAnimalEdge.create().then(
      () => {
        log('animalAnimal edgeCollection created');
      },
      err => {
        throw new Error({ msg: 'Failed to create edgeCollection', err });
      }
    );
  } else {
    log('animalAnimal edgeCollection already exists');
  }
}

async function createFromAnimalToWeightsEdge(db) {
  const animalWeightsEdge = await db.edgeCollection('fromAnimalToWeight');
  const result = await animalWeightsEdge.exists();
  if (!result) {
    animalWeightsEdge.create().then(
      () => {
        log('animalWeights edgeCollection created');
      },
      err => {
        throw new Error({ msg: 'Failed to create edgeCollection', err });
      }
    );
  } else {
    log('animalWeights edgeCollection already exists');
  }
}

async function createFromAnimalToExpensesEdge(db) {
  const animalExpensesEdge = await db.edgeCollection('fromAnimalToExpenses');
  const result = await animalExpensesEdge.exists();
  if (!result) {
    animalExpensesEdge.create().then(
      () => {
        log('animalExpenses edgeCollection created');
      },
      err => {
        throw new Error({ msg: 'Failed to create edgeCollection', err });
      }
    );
  } else {
    log('animalExpenses edgeCollection already exists');
  }
}

async function createFromVaccineToExpensesEdge(db) {
  const vaccineExpensesEdge = await db.edgeCollection('fromVaccineToExpenses');
  const result = await vaccineExpensesEdge.exists();
  if (!result) {
    vaccineExpensesEdge.create().then(
      () => {
        log('vaccineExpenses edgeCollection created');
      },
      err => {
        throw new Error({ msg: 'Failed to create edgeCollection', err });
      }
    );
  } else {
    log('vaccineExpenses edgeCollection already exists');
  }
}

async function createFromAnimalToVaccineEdge(db) {
  const animalVaccineEdge = await db.edgeCollection('fromAnimalToVaccine');
  const result = await animalVaccineEdge.exists();
  if (!result) {
    animalVaccineEdge.create().then(
      () => {
        log('animalVaccine edgeCollection created');
      },
      err => {
        throw new Error({ msg: 'Failed to create edgeCollection', err });
      }
    );
  } else {
    log('animalVaccine edgeCollection already exists');
  }
}

async function createFromAnimalToDiseaseEdge(db) {
  const animalDiseaseEdge = await db.edgeCollection('fromAnimalToDisease');
  const result = await animalDiseaseEdge.exists();
  if (!result) {
    animalDiseaseEdge.create().then(
      () => {
        log('animalDisease edgeCollection created');
      },
      err => {
        throw new Error({ msg: 'Failed to create edgeCollection', err });
      }
    );
  } else {
    log('animalDisease edgeCollection already exists');
  }
}
/* -------------------------------------------------------------------------- */
/*                                    views                                   */
/* -------------------------------------------------------------------------- */
async function createAnimalView(db) {
  const animalView = db.arangoSearchView('animalView');

  const result = await animalView.exists();
  if (!result) {
    animalView.create().then(
      async () => {
        log('animalView created');
        await animalView.setProperties({
          links: {
            animals: {
              includeAllFields: true,
            },
          },
        });
      },
      err => {
        throw new Error({ msg: 'Failed to create view', err });
      }
    );
  } else {
    log('animalView laready exists');
  }
}

export default db => {
  return new Promise((resolve, reject) => {
    try {
      (async () => {
        // documents
        await createAnimalsCollection(db);
        await createUsersCollection(db);
        await createLogsCollection(db);
        // await createRecordsCollection(db);
        await createWeightsCollection(db);
        await createExpensesCollection(db);
        await createVaccineCollection(db);
        await createDiseaseCollection(db);
        // edges
        // await createAnimalRecodEdge(db);
        await createFromAnimalToAnimalEdge(db);
        await createFromAnimalToWeightsEdge(db);
        await createFromAnimalToExpensesEdge(db);
        await createFromVaccineToExpensesEdge(db);
        await createFromAnimalToVaccineEdge(db);
        await createFromAnimalToDiseaseEdge(db);
        //views
        await createAnimalView(db);
        // resolve
        resolve(true);
      })();
    } catch (error) {
      reject(error);
    }
  });
};
