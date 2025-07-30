
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

// Firebase configuration is loaded from environment variables
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
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error("Firebase configuration is missing. Make sure your ***REMOVED***.local file is set up correctly.");
}


// Initialize Firebase for client-side rendering, ensuring it's done only once.
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);
