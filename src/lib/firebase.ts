// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

// Firebase configuration is now loaded via environment variables defined in next.config.js
const firebaseConfig = {
  apiKey: process***REMOVED***.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process***REMOVED***.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process***REMOVED***.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process***REMOVED***.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process***REMOVED***.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process***REMOVED***.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process***REMOVED***.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};


// Basic check to ensure Firebase config is loaded
if (!firebaseConfig || !firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error("Firebase configuration is missing. Make sure your environment variables are set up correctly and passed through next.config.js.");
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
