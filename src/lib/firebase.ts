
// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

// Firebase configuration is loaded from environment variables
const firebaseConfig = {
  apiKey: "***REMOVED***",
  authDomain: "tasia-6f771.firebaseapp.com",
  projectId: "tasia-6f771",
  storageBucket: "tasia-6f771.appspot.com",
  messagingSenderId: "204877276202",
  appId: "1:204877276202:web:31db4eb5b1c1b7c4078f53",
  measurementId: process***REMOVED***.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Basic check to ensure Firebase config is loaded
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error("Firebase configuration is missing. Make sure your ***REMOVED***.local file is set up correctly and next.config.js is configured to pass them.");
}

// Initialize Firebase for client-side rendering, ensuring it's done only once.
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

// Enable offline persistence
if (typeof window !== 'undefined') {
    enableIndexedDbPersistence(db)
      .catch((err) => {
        if (err.code == 'failed-precondition') {
          // Multiple tabs open, persistence can only be enabled in one tab at a time.
          console.warn("Firestore persistence failed: Multiple tabs open.");
        } else if (err.code == 'unimplemented') {
          // The current browser does not support all of the
          // features required to enable persistence
          console.warn("Firestore persistence not supported in this browser.");
        }
      });
}
