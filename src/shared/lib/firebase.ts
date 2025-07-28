
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

// "Source of Truth" for Firebase Config
const firebaseConfig = {
  apiKey: process***REMOVED***.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process***REMOVED***.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process***REMOVED***.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process***REMOVED***.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process***REMOVED***.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process***REMOVED***.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase for client-side rendering, ensuring it's done only once.
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);
