// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "***REMOVED***",
    authDomain: "tasia-6f77i.firebaseapp.com",
    projectId: "tasia-6f77i",
    storageBucket: "tasia-6f77i.appspot.com",
    messagingSenderId: "204877276202",
    appId: "1:204877276202:web:31db4eb5b1c1b7c4078f53"
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
