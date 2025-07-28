
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

// "Source of Truth" for Firebase Config
const firebaseConfig = {
  apiKey: "***REMOVED***4",
  authDomain: "tasia-6f771.firebaseapp.com",
  projectId: "tasia-6f771",
  storageBucket: "tasia-6f771.appspot.com",
  messagingSenderId: "204877276202",
  appId: "1:204877276202:web:31db4eb5b1c1b7c4078f53",
  measurementId: "G-9XG5NE9TTD"
};

// Initialize Firebase for client-side rendering, ensuring it's done only once.
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);
