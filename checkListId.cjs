process.env.FIRESTORE_EMULATOR_HOST = "localhost:8081"; // ΠΡΕΠΕΙ να μπει ΠΡΙΝ την αρχικοποίηση

const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: serviceAccount.project_id,
});

const db = admin.firestore();

const collectionName = "tsia-complex-entities";
const docId = "00ABWDQmABQWXPAem5Ya";

async function checkListId() {
  try {
    const docRef = db.collection(collectionName).doc(docId);
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      console.log("Document data:", docSnap.data());
    } else {
      console.log("No document found!");
    }
  } catch (error) {
    console.error("Error fetching document:", error);
  }
}

checkListId();
