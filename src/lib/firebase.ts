// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process***REMOVED***.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process***REMOVED***.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process***REMOVED***.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process***REMOVED***.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process***REMOVED***.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process***REMOVED***.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process***REMOVED***.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}


export { app, db, analytics };
