import { initializeApp } from 'firebase/app';
import {
  connectFirestoreEmulator,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from 'firebase/firestore';
import { connectDatabaseEmulator, getDatabase } from 'firebase/database';
import { connectAuthEmulator, getAuth } from 'firebase/auth';

const {
  VITE_FIREBASE_API_KEY,
  VITE_FIREBASE_AUTH_DOMAIN,
  VITE_FIREBASE_PROJECT_ID,
  VITE_FIREBASE_STORAGE_BUCKET,
  VITE_FIREBASE_MESSAGING_SENDER_ID,
  VITE_FIREBASE_APP_ID,
  VITE_FIREBASE_MEASUREMENT_ID,
  VITE_FIREBASE_DATABASE_URL,
  VITE_FIRESTORE_EMULATOR_HOST,
  VITE_DATABASE_EMULATOR_HOST,
  VITE_AUTH_EMULATOR_HOST,
} = import.meta.env;

const firebaseConfig = {
  apiKey: VITE_FIREBASE_API_KEY,
  authDomain: VITE_FIREBASE_AUTH_DOMAIN,
  projectId: VITE_FIREBASE_PROJECT_ID,
  storageBucket: VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: VITE_FIREBASE_APP_ID,
  measurementId: VITE_FIREBASE_MEASUREMENT_ID,
  databaseURL: VITE_FIREBASE_DATABASE_URL,
};

const app = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(app);

const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
  }),
});

const rtdb = getDatabase(app);

if (import.meta.env.DEV) {
  connectFirestoreEmulator(db, `${VITE_FIRESTORE_EMULATOR_HOST}`, 8080);
  connectDatabaseEmulator(rtdb, `${VITE_DATABASE_EMULATOR_HOST}`, 9000);
  connectAuthEmulator(firebaseAuth, `http://${VITE_AUTH_EMULATOR_HOST}:9099`, {
    disableWarnings: true,
  });
}

export { firebaseAuth, db, rtdb };
