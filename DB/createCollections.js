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

async function createVaccinesCollection(db) {
  const vaccinesCollection = await db.collection('vaccines');
  const result = await vaccinesCollection.exists();
  if (!result) {
    vaccinesCollection.create().then(
      () => {
        log('vaccines collection created');
      },
      err => {
        throw new Error({ msg: 'Failed to create collection', err });
      }
    );
  } else {
    log('vaccines collection already exists');
  }
}

async function createDiseasesCollection(db) {
  const diseaseCollection = await db.collection('diseases');
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

async function createIncomesCollection(db) {
  const incomeCollection = await db.collection('incomes');
  const result = await incomeCollection.exists();
  if (!result) {
    incomeCollection.create().then(
      () => {
        log('income collection created');
      },
      err => {
        throw new Error({ msg: 'Failed to create collection', err });
      }
    );
  } else {
    log('income collection already exists');
  }
}

async function createExitsCollection(db) {
  const exitsCollection = await db.collection('exits');
  const result = await exitsCollection.exists();
  if (!result) {
    exitsCollection.create().then(
      () => {
        log('exits collection created');
      },
      err => {
        throw new Error({ msg: 'Failed to create collection', err });
      }
    );
  } else {
    log('exits collection already exists');
  }
}

async function createMilksCollection(db) {
  const milksCollection = await db.collection('milks');
  const result = await milksCollection.exists();
  if (!result) {
    milksCollection.create().then(
      () => {
        log('milks collection created');
      },
      err => {
        throw new Error({ msg: 'Failed to create collection', err });
      }
    );
  } else {
    log('milks collection already exists');
  }
}

async function createPregnanciesCollection(db) {
  const pregnanciesCollection = await db.collection('pregnancies');
  const result = await pregnanciesCollection.exists();
  if (!result) {
    pregnanciesCollection.create().then(
      () => {
        log('pregnancies collection created');
      },
      err => {
        throw new Error({ msg: 'Failed to create collection', err });
      }
    );
  } else {
    log('pregnancies collection already exists');
  }
}

async function createDiseaseStepsCollection(db) {
  const diseaseStepsCollection = await db.collection('diseaseSteps');
  const result = await diseaseStepsCollection.exists();
  if (!result) {
    diseaseStepsCollection.create().then(
      () => {
        log('diseaseSteps collection created');
      },
      err => {
        throw new Error({ msg: 'Failed to create collection', err });
      }
    );
  } else {
    log('diseaseSteps collection already exists');
  }
}

async function createErrorsCollection(db) {
  const errorsCollection = await db.collection('errors');
  const result = await errorsCollection.exists();
  if (!result) {
    errorsCollection.create().then(
      () => {
        log('errors collection created');
      },
      err => {
        throw new Error({ msg: 'Failed to create collection', err });
      }
    );
  } else {
    log('errors collection already exists');
  }
}
/* -------------------------------------------------------------------------- */
/*                                    edges                                   */
/* -------------------------------------------------------------------------- */
// async function createAnimalRecodEdge(db) {
//   const animalRecordsEdge = await db.edgeCollection('animalRecords');
//   const result = await animalRecordsEdge.exists();
//   //   if (!result) {
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

async function createAnimalEdges(db) {
  const animalEdges = await db.edgeCollection('animalEdges');
  const result = await animalEdges.exists();
  if (!result) {
    animalEdges.create().then(
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

async function createUserEdges(db) {
  const userEdges = await db.edgeCollection('userEdges');
  const result = await userEdges.exists();
  if (!result) {
    userEdges.create().then(
      () => {
        log('user edgeCollection created');
      },
      err => {
        throw new Error({ msg: 'Failed to create edgeCollection', err });
      }
    );
  } else {
    log('user edgeCollection already exists');
  }
}

async function createExitEdges(db) {
  const exitEdges = await db.edgeCollection('exitEdges');
  const result = await exitEdges.exists();
  if (!result) {
    exitEdges.create().then(
      () => {
        log('exit edgeCollection created');
      },
      err => {
        throw new Error({ msg: 'Failed to create edgeCollection', err });
      }
    );
  } else {
    log('exit edgeCollection already exists');
  }
}

async function createWeightEdges(db) {
  const weightEdges = await db.edgeCollection('weightEdges');
  const result = await weightEdges.exists();
  if (!result) {
    weightEdges.create().then(
      () => {
        log('weight edgeCollection created');
      },
      err => {
        throw new Error({ msg: 'Failed to create edgeCollection', err });
      }
    );
  } else {
    log('weight edgeCollection already exists');
  }
}

async function createIncomeEdges(db) {
  const incomeEdges = await db.edgeCollection('incomeEdges');
  const result = await incomeEdges.exists();
  if (!result) {
    incomeEdges.create().then(
      () => {
        log('income edgeCollection created');
      },
      err => {
        throw new Error({ msg: 'Failed to create edgeCollection', err });
      }
    );
  } else {
    log('income edgeCollection already exists');
  }
}

async function createExpenseEdges(db) {
  const expenseEdges = await db.edgeCollection('expenseEdges');
  const result = await expenseEdges.exists();
  if (!result) {
    expenseEdges.create().then(
      () => {
        log('expense edgeCollection created');
      },
      err => {
        throw new Error({ msg: 'Failed to create edgeCollection', err });
      }
    );
  } else {
    log('expense edgeCollection already exists');
  }
}

async function createMilkEdges(db) {
  const milkEdges = await db.edgeCollection('milkEdges');
  const result = await milkEdges.exists();
  if (!result) {
    milkEdges.create().then(
      () => {
        log('milk edgeCollection created');
      },
      err => {
        throw new Error({ msg: 'Failed to create edgeCollection', err });
      }
    );
  } else {
    log('milk edgeCollection already exists');
  }
}

async function createDiseaseEdges(db) {
  const diseaseEdges = await db.edgeCollection('diseaseEdges');
  const result = await diseaseEdges.exists();
  if (!result) {
    diseaseEdges.create().then(
      () => {
        log('disease edgeCollection created');
      },
      err => {
        throw new Error({ msg: 'Failed to create edgeCollection', err });
      }
    );
  } else {
    log('disease edgeCollection already exists');
  }
}

async function createPregnancyEdges(db) {
  const pregnancyEdges = await db.edgeCollection('pregnancyEdges');
  const result = await pregnancyEdges.exists();
  if (!result) {
    pregnancyEdges.create().then(
      () => {
        log('pregnancy edgeCollection created');
      },
      err => {
        throw new Error({ msg: 'Failed to create edgeCollection', err });
      }
    );
  } else {
    log('pregnancy edgeCollection already exists');
  }
}

async function createVaccineEdges(db) {
  const vaccineEdges = await db.edgeCollection('vaccineEdges');
  const result = await vaccineEdges.exists();
  if (!result) {
    vaccineEdges.create().then(
      () => {
        log('vaccine edgeCollection created');
      },
      err => {
        throw new Error({ msg: 'Failed to create edgeCollection', err });
      }
    );
  } else {
    log('vaccine edgeCollection already exists');
  }
}

async function createLogEdges(db) {
  const logEdge = await db.edgeCollection('logEdge');
  const result = await logEdge.exists();
  if (!result) {
    logEdge.create().then(
      () => {
        log('vaccine edgeCollection created');
      },
      err => {
        throw new Error({ msg: 'Failed to create edgeCollection', err });
      }
    );
  } else {
    log('vaccine edgeCollection already exists');
  }
}

// async function createFromAnimalToWeightsEdge(db) {
//   const animalWeightsEdge = await db.edgeCollection('fromAnimalToWeight');
//   const result = await animalWeightsEdge.exists();
//   if (!result) {
//     animalWeightsEdge.create().then(
//       () => {
//         log('animalWeights edgeCollection created');
//       },
//       err => {
//         throw new Error({ msg: 'Failed to create edgeCollection', err });
//       }
//     );
//   } else {
//     log('animalWeights edgeCollection already exists');
//   }
// }

// async function createFromAnimalToExpensesEdge(db) {
//   const animalExpensesEdge = await db.edgeCollection('fromAnimalToExpenses');
//   const result = await animalExpensesEdge.exists();
//   if (!result) {
//     animalExpensesEdge.create().then(
//       () => {
//         log('animalExpenses edgeCollection created');
//       },
//       err => {
//         throw new Error({ msg: 'Failed to create edgeCollection', err });
//       }
//     );
//   } else {
//     log('animalExpenses edgeCollection already exists');
//   }
// }

// // async function createFromVaccineToExpensesEdge(db) {
// //   const vaccineExpensesEdge = await db.edgeCollection('fromVaccineToExpenses');
// //   const result = await vaccineExpensesEdge.exists();
// //   if (!result) {
// //     vaccineExpensesEdge.create().then(
// //       () => {
// //         log('vaccineExpenses edgeCollection created');
// //       },
// //       err => {
// //         throw new Error({ msg: 'Failed to create edgeCollection', err });
// //       }
// //     );
// //   } else {
// //     log('vaccineExpenses edgeCollection already exists');
// //   }
// // }

// async function createFromAnimalToVaccineEdge(db) {
//   const animalVaccineEdge = await db.edgeCollection('fromAnimalToVaccine');
//   const result = await animalVaccineEdge.exists();
//   if (!result) {
//     animalVaccineEdge.create().then(
//       () => {
//         log('animalVaccine edgeCollection created');
//       },
//       err => {
//         throw new Error({ msg: 'Failed to create edgeCollection', err });
//       }
//     );
//   } else {
//     log('animalVaccine edgeCollection already exists');
//   }
// }

// async function createFromAnimalToDiseaseEdge(db) {
//   const animalDiseaseEdge = await db.edgeCollection('fromAnimalToDisease');
//   const result = await animalDiseaseEdge.exists();
//   if (!result) {
//     animalDiseaseEdge.create().then(
//       () => {
//         log('animalDisease edgeCollection created');
//       },
//       err => {
//         throw new Error({ msg: 'Failed to create edgeCollection', err });
//       }
//     );
//   } else {
//     log('animalDisease edgeCollection already exists');
//   }
// }

// async function createFromAnimalToIncomeEdge(db) {
//   const animalIncomeEdge = await db.edgeCollection('fromAnimalToIncome');
//   const result = await animalIncomeEdge.exists();
//   if (!result) {
//     animalIncomeEdge.create().then(
//       () => {
//         log('animalIncome edgeCollection created');
//       },
//       err => {
//         throw new Error({ msg: 'Failed to create edgeCollection', err });
//       }
//     );
//   } else {
//     log('animalIncome edgeCollection already exists');
//   }
// }

// async function createFromAnimalToOutEdge(db) {
//   const animalOutEdge = await db.edgeCollection('fromAnimalToOut');
//   const result = await animalOutEdge.exists();
//   if (!result) {
//     animalOutEdge.create().then(
//       () => {
//         log('animalOut edgeCollection created');
//       },
//       err => {
//         throw new Error({ msg: 'Failed to create edgeCollection', err });
//       }
//     );
//   } else {
//     log('animalOut edgeCollection already exists');
//   }
// }

// async function createFromAnimalToMilkEdge(db) {
//   const animalMilkEdge = await db.edgeCollection('fromAnimalToMilk');
//   const result = await animalMilkEdge.exists();
//   if (!result) {
//     animalMilkEdge.create().then(
//       () => {
//         log('animalMilk edgeCollection created');
//       },
//       err => {
//         throw new Error({ msg: 'Failed to create edgeCollection', err });
//       }
//     );
//   } else {
//     log('animalMilk edgeCollection already exists');
//   }
// }

// async function createFromAnimalToPregnancyEdge(db) {
//   const animalPregnancyEdge = await db.edgeCollection('fromAnimalToPregnancy');
//   const result = await animalPregnancyEdge.exists();
//   if (!result) {
//     animalPregnancyEdge.create().then(
//       () => {
//         log('animalPregnancy edgeCollection created');
//       },
//       err => {
//         throw new Error({ msg: 'Failed to create edgeCollection', err });
//       }
//     );
//   } else {
//     log('animalPregnancy edgeCollection already exists');
//   }
// }

// // async function createFromPregnancyToAnimalEdge(db) {
// //   const pregnancyAnimalEdge = await db.edgeCollection('fromPregnancyToAnimal');
// //   const result = await pregnancyAnimalEdge.exists();
// //   if (!result) {
// //     pregnancyAnimalEdge.create().then(
// //       () => {
// //         log('pregnancyAnimal edgeCollection created');
// //       },
// //       err => {
// //         throw new Error({ msg: 'Failed to create edgeCollection', err });
// //       }
// //     );
// //   } else {
// //     log('pregnancyAnimal edgeCollection already exists');
// //   }
// // }

// async function createFromDiseaseToDiseaseRelatedEdge(db) {
//   const diseaseDiseaseRelated = await db.edgeCollection('fromDiseaseToDiseaseRelated');
//   const result = await diseaseDiseaseRelated.exists();
//   if (!result) {
//     diseaseDiseaseRelated.create().then(
//       () => {
//         log('diseaseDiseaseRelated edgeCollection created');
//       },
//       err => {
//         throw new Error({ msg: 'Failed to create edgeCollection', err });
//       }
//     );
//   } else {
//     log('diseaseDiseaseRelated edgeCollection already exists');
//   }
// }

// async function createFromOutToDiseaseEdge(db) {
//   const outDiseaseEdge = await db.edgeCollection('fromOutToDisease');
//   const result = await outDiseaseEdge.exists();
//   if (!result) {
//     outDiseaseEdge.create().then(
//       () => {
//         log('outDiseaseEdge edgeCollection created');
//       },
//       err => {
//         throw new Error({ msg: 'Failed to create edgeCollection', err });
//       }
//     );
//   } else {
//     log('outDiseaseEdge edgeCollection already exists');
//   }
// }

// async function createFromOutToIncomeEdge(db) {
//   const outIncomeEdge = await db.edgeCollection('fromOutToIncome');
//   const result = await outIncomeEdge.exists();
//   if (!result) {
//     outIncomeEdge.create().then(
//       () => {
//         log('outIncomeEdge edgeCollection created');
//       },
//       err => {
//         throw new Error({ msg: 'Failed to create edgeCollection', err });
//       }
//     );
//   } else {
//     log('outIncomeEdge edgeCollection already exists');
//   }
// }
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
        await createWeightsCollection(db);
        await createExpensesCollection(db);
        await createVaccinesCollection(db);
        await createDiseasesCollection(db);
        await createDiseaseStepsCollection(db);
        await createIncomesCollection(db);
        await createExitsCollection(db);
        await createMilksCollection(db);
        await createPregnanciesCollection(db);
        // edges
        await createAnimalEdges(db);
        await createUserEdges(db);
        await createWeightEdges(db);
        await createExpenseEdges(db);
        await createVaccineEdges(db);
        await createDiseaseEdges(db);
        await createIncomeEdges(db);
        await createExitEdges(db);
        await createMilkEdges(db);
        await createPregnancyEdges(db);
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
