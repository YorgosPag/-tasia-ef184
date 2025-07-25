
// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "***REMOVED***",
  authDomain: "tasia-dev.firebaseapp.com",
  projectId: "tasia-dev",
  storageBucket: "tasia-dev.appspot.com",
  messagingSenderId: "955521526644",
  appId: "1:955521526644:web:0f4f4d8058204f13a07851",
  measurementId: "G-9XG18S6YTH"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
let analytics;
if (typeof window !== 'undefined') {
    try {
        if (firebaseConfig.measurementId) {
            analytics = getAnalytics(app);
        }
    } catch (error) {
        console.log('Firebase Analytics not available in this environment.');
    }
}


export { app, db, auth, storage, analytics };
