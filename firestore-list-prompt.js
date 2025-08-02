const { Firestore } = require('@google-cloud/firestore');
const readline = require('readline');

const firestore = new Firestore();

async function listCollections() {
  const collections = await firestore.listCollections();
  if (collections.length === 0) {
    console.log('Δεν βρέθηκαν συλλογές στη βάση.');
  } else {
    console.log('Διαθέσιμες συλλογές:');
    collections.forEach(col => console.log('- ' + col.id));
  }
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

(async () => {
  await listCollections();

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
})();
