// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "***REMOVED***",
  authDomain: "tasia-ef184.firebaseapp.com",
  projectId: "tasia-ef184",
  storageBucket: "tasia-ef184.appspot.com",
  messagingSenderId: "530948962171",
  appId: "1:530948962171:web:e73defedb6202a2cb06fde",
  measurementId: "G-BJ0TBMVSS1"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}


export { app, analytics };
