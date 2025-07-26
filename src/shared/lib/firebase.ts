// src/shared/lib/firebase.ts
'use client'; // Είναι σημαντικό αν χρησιμοποιείς Next.js App Router

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; // Αν χρησιμοποιείς Auth
import { getStorage } from 'firebase/storage'; // Αν χρησιμοποιείς Storage
import { getFunctions } from 'firebase/functions'; // Αν χρησιμοποιείς Functions

// Βήμα 1: Συμπλήρωσε τα δικά σου Firebase Config στοιχεία
// Θα τα βρεις στην κονσόλα του Firebase: Project settings (γρανάζι) -> Your apps -> Web app
const firebaseConfig = {
  apiKey: "***REMOVED***",
  authDomain: "tasia-6f77i.firebaseapp.com",
  projectId: "tasia-6f77i",
  storageBucket: "tasia-6f77i.appspot.com",
  messagingSenderId: "204877276202",
  appId: "1:204877276202:web:31db4eb5b1c1b7c4078f53"
};

// Βήμα 2: Αρχικοποίηση Firebase app
let app;
if (!getApps().length) {
  // Αν δεν υπάρχει ήδη app, αρχικοποίησέ το
  app = initializeApp(firebaseConfig);
} else {
  // Αν υπάρχει ήδη app (π.χ. σε hot reload στο Next.js), χρησιμοποίησε το υπάρχον
  app = getApp();
}

// Βήμα 3: Λήψη υπηρεσιών Firebase
// Εξαγωγή των υπηρεσιών για χρήση σε άλλα μέρη της εφαρμογής
export const db = getFirestore(app);
export const auth = getAuth(app); // Αν χρησιμοποιείς Firebase Authentication
export const storage = getStorage(app); // Αν χρησιμοποιείς Firebase Storage
export const functions = getFunctions(app); // Αν χρησιμοποιείς Firebase Functions (π.χ. για Cloud Functions)

// Βήμα 4: Πρόσθεσε αυτό το console.log για debugging
console.log('Firebase App Initialized:', app.name);
console.log('Firestore DB instance:', db.app.name);