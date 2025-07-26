
// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process***REMOVED***.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process***REMOVED***.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process***REMOVED***.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process***REMOVED***.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process***REMOVED***.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process***REMOVED***.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process***REMOVED***.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
let analytics;

// Conditionally initialize Analytics only if all required configs are available
if (
  typeof window !== 'undefined' &&
  firebaseConfig.apiKey &&
  firebaseConfig.measurementId
) {
  isSupported().then((supported) => {
    if (supported) {
      try {
        analytics = getAnalytics(app);
      } catch (error) {
        console.error("Firebase Analytics initialization failed:", error);
      }
    } else {
        console.log("Firebase Analytics is not supported in this environment.");
    }
  });
} else if (typeof window !== 'undefined') {
    console.log("Firebase Analytics not initialized due to missing apiKey or measurementId.");
}

export { app, db, auth, storage, analytics };
