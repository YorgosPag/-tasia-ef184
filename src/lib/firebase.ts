
// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
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
if (typeof window !== 'undefined') {
    try {
        analytics = getAnalytics(app);
    } catch (error) {
        console.log('Firebase Analytics not available in this environment.');
    }
}

export { app, db, auth, storage, analytics };
