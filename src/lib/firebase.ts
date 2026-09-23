import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App singleton safely
export const firebaseApp = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp();

// Use the designated Firestore Database ID specified in firebase-applet-config.json
const firestoreDbId = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? firebaseConfig.firestoreDatabaseId
  : undefined;

export const db = firestoreDbId
  ? getFirestore(firebaseApp, firestoreDbId)
  : getFirestore(firebaseApp);

export const auth = getAuth(firebaseApp);

export default firebaseApp;
