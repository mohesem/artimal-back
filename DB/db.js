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
        host: 'localhost',
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
const Users = db.collection('users');
const Animals = db.collection('animals');
const Logs = db.collection('logs');
const Weights = db.collection('weights');
const Expenses = db.collection('expenses');
const Vaccines = db.collection('vaccines');
const Incomes = db.collection('incomes');
const Exits = db.collection('exits');
const Milks = db.collection('milks');
const Pregnancies = db.collection('pregnancies');
const Diseases = db.collection('diseases');
const DiseaseSteps = db.collection('diseaseSteps');
const Errors = db.collection('errors');

/* -------------------------------------------------------------------------- */
/*                              edge collections                              */
/* -------------------------------------------------------------------------- */

const UserEdges = db.edgeCollection('userEdges');
const AnimalEdges = db.edgeCollection('animalEdges');
const WeightEdges = db.edgeCollection('weightEdges');
const ExpenseEdges = db.edgeCollection('expenseEdges');
const VaccineEdges = db.edgeCollection('vaccineEdges');
const IncomeEdges = db.edgeCollection('incomeEdges');
const ExitEdges = db.edgeCollection('exitEdges');
const MilkEdges = db.edgeCollection('milkEdges');
const PregnancyEdges = db.edgeCollection('pregnancyEdges');
const DiseaseEdges = db.edgeCollection('diseaseEdges');
const LogEdges = db.edgeCollection('logEdges');

// const fromAnimalToAnimal = db.edgeCollection('fromAnimalToAnimal');
// const fromAnimalToWeight = db.edgeCollection('fromAnimalToWeight');
// const fromAnimalToExpenses = db.edgeCollection('fromAnimalToExpenses');
// // const fromVaccineToExpenses = db.edgeCollection('fromVaccineToExpenses');
// const fromAnimalToVaccine = db.edgeCollection('fromAnimalToVaccine');
// const fromAnimalToIncome = db.edgeCollection('fromAnimalToIncome');
// const fromAnimalToOut = db.edgeCollection('fromAnimalToOut');
// const fromAnimalToMilk = db.edgeCollection('fromAnimalToMilk');
// const fromAnimalToPregnancy = db.edgeCollection('fromAnimalToPregnancy');
// // const fromPregnancyToAnimal = db.edgeCollection('fromPregnancyToAnimal');
// const fromAnimalToDisease = db.edgeCollection('fromAnimalToDisease');
// const fromDiseaseToDiseaseRelated = db.edgeCollection('fromDiseaseToDiseaseRelated');
// const fromOutToDisease = db.edgeCollection('fromOutToDisease');
// const fromOutToIncome = db.edgeCollection('fromOutToIncome');
/* -------------------------------------------------------------------------- */
/*                                    views                                   */
/* -------------------------------------------------------------------------- */

export {
  db,
  // collections
  Users,
  Animals,
  Logs,
  Weights,
  Expenses,
  Vaccines,
  Incomes,
  Exits,
  Milks,
  Pregnancies,
  Diseases,
  DiseaseSteps,
  Errors,
  // edges
  UserEdges,
  AnimalEdges,
  WeightEdges,
  ExpenseEdges,
  VaccineEdges,
  IncomeEdges,
  ExitEdges,
  MilkEdges,
  PregnancyEdges,
  DiseaseEdges,
  LogEdges,
};
