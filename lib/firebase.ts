import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const normalizeEnvValue = (value: string | undefined) => {
  const normalized = (value || '').trim();
  if (!normalized) return '';
  const lowered = normalized.toLowerCase();
  if (lowered === 'undefined' || lowered === 'null') return '';
  return normalized;
};

const resolveEnv = (publicKey: string, privateKey: string) =>
  normalizeEnvValue(process.env[publicKey]) || normalizeEnvValue(process.env[privateKey]) || '';

const firebaseConfig = {
  apiKey: resolveEnv('NEXT_PUBLIC_FIREBASE_API_KEY', 'FIREBASE_API_KEY'),
  authDomain: resolveEnv('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', 'FIREBASE_AUTH_DOMAIN'),
  projectId: resolveEnv('NEXT_PUBLIC_FIREBASE_PROJECT_ID', 'FIREBASE_PROJECT_ID'),
  storageBucket: resolveEnv('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET', 'FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: resolveEnv(
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'FIREBASE_MESSAGING_SENDER_ID'
  ),
  appId: resolveEnv('NEXT_PUBLIC_FIREBASE_APP_ID', 'FIREBASE_APP_ID'),
  measurementId: resolveEnv('NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID', 'FIREBASE_MEASUREMENT_ID'),
};

const requiredKeys = {
  NEXT_PUBLIC_FIREBASE_API_KEY: firebaseConfig.apiKey,
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: firebaseConfig.authDomain,
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: firebaseConfig.projectId,
  NEXT_PUBLIC_FIREBASE_APP_ID: firebaseConfig.appId,
} as const;

const missingRequiredKeys = Object.entries(requiredKeys)
  .filter(([, value]) => !value)
  .map(([key]) => key);

export const isFirebaseConfigured = missingRequiredKeys.length === 0;

let firebaseApp = null;

if (isFirebaseConfigured) {
  firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
}

export const auth = firebaseApp ? getAuth(firebaseApp) : null;
export const db = firebaseApp ? getFirestore(firebaseApp) : null;

export function assertFirebaseConfigured() {
  if (!isFirebaseConfigured || !auth || !db) {
    const missing = missingRequiredKeys.length > 0 ? missingRequiredKeys.join(', ') : 'unknown';
    throw new Error(`Firebase is not configured. Missing one or more env vars: ${missing}`);
  }
}
