import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
  measurementId: process.env.measurementId
};

// Prevent Firebase initialization during build or when API key is missing
let app = null;
if (!process.env.SKIP_FIREBASE && process.env.apiKey) {
  app = initializeApp(firebaseConfig);
} else {
  // When building without Firebase credentials, skip init to avoid errors
  /* eslint-disable no-console */
  console.warn('Firebase initialization skipped (SKIP_FIREBASE or missing apiKey)');
}

export const auth = app ? getAuth(app) : null;
export const googleProvider = app ? new GoogleAuthProvider() : null;

export const db = app ? getFirestore(app) : null;