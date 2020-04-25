import { Database } from 'arangojs';
import createCollections from './createCollections';

const dbConfig =
  process.env.ENV === 'dev'
    ? {
        host: 'localhost',
        port: '8529',
        username: 'artiman',
        password: 'artiman',
        database: 'artiman',
      }
    : {
        host: '194.5.175.201',
        port: '8529',
        username: 'artimal',
        password: '9KXgTVYmVTBuUuEvURUBBbnfhzwTp4Yc',
        database: 'artimal',
      };

const db = new Database({
  url: `http://${dbConfig.host}:${dbConfig.port}`,
});
db.useBasicAuth(dbConfig.username, dbConfig.password);
db.useDatabase(dbConfig.database);
createCollections(db);

/* -------------------------------------------------------------------------- */
/*                                 collections                                */
/* -------------------------------------------------------------------------- */
const userCollection = db.collection('users');
const animalCollection = db.collection('animals');
const logCollection = db.collection('logs');
const weightCollection = db.collection('weights');
const expensesCollection = db.collection('expenses');
const vaccineCollection = db.collection('vaccine');

/* -------------------------------------------------------------------------- */
/*                              edge collections                              */
/* -------------------------------------------------------------------------- */
const fromAnimalToAnimal = db.edgeCollection('fromAnimalToAnimal');
const fromAnimalToWeight = db.edgeCollection('fromAnimalToWeight');
const fromAnimalToExpenses = db.edgeCollection('fromAnimalToExpenses');
const fromVaccineToExpenses = db.edgeCollection('fromVaccineToExpenses');
const fromAnimalToVaccine = db.edgeCollection('fromAnimalToVaccine');
/* -------------------------------------------------------------------------- */
/*                                    views                                   */
/* -------------------------------------------------------------------------- */

export {
  db,
  // collection
  userCollection,
  animalCollection,
  logCollection,
  weightCollection,
  expensesCollection,
  vaccineCollection,
  // edge
  fromAnimalToExpenses,
  fromAnimalToWeight,
  fromAnimalToAnimal,
  fromVaccineToExpenses,
  fromAnimalToVaccine,
};
