import { initializeApp, getApps } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";

// Firebase config (βάλε τα δικά σου ή import)
const firebaseConfig = {
  apiKey: "AIzaSyCzb4bEOYVnUwit2r6wCdL1h06Jdyi7Woc",
  authDomain: "tasia-6f77i.firebaseapp.com",
  projectId: "tasia-6f77i",
  storageBucket: "tasia-6f77i.appspot.com",
  messagingSenderId: "204877276202",
  appId: "1:204877276202:web:31db4eb5b1c1b7c4078f53",
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);

const collectionName = "tsia-complex-entities";
const docId = "00ABWDQmABQWXP Aem5Ya".replace(/\s/g, ""); // ΜΗΝ αφήσεις κενά

async function checkDocument() {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.error("Error fetching document:", error);
  }
}

checkDocument();
