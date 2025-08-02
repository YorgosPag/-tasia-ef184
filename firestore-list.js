const { Firestore } = require('@google-cloud/firestore');
const readline = require('readline');

const firestore = new Firestore();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Δώσε το όνομα της συλλογής: ', async (collectionName) => {
  try {
    const snapshot = await firestore.collection(collectionName).limit(10).get();
    if (snapshot.empty) {
      console.log('Η συλλογή είναι κενή ή δεν βρέθηκαν έγγραφα.');
    } else {
      snapshot.forEach(doc => {
        console.log(doc.id, '=>', doc.data());
      });
    }
  } catch (error) {
    console.error('Σφάλμα:', error);
  }
  rl.close();
});
