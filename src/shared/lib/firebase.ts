// src/shared/lib/firebase.ts

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; 
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

// "Source of Truth" for Firebase Config
const firebaseConfig = {
  apiKey: "***REMOVED***",
  authDomain: "tasia-6f77i.firebaseapp.com",
  projectId: "tasia-6f77i",
  storageBucket: "tasia-6f77i.appspot.com",
  messagingSenderId: "204877276202",
  appId: "1:204877276202:web:31db4eb5b1c1b7c4078f53"
};

// Initialize Firebase safely for both server and client
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Export services for use in other parts of the application
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);
