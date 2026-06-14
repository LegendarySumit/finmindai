import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const normalizeEnvValue = (value: string | undefined) => {
  const normalized = (value || "").trim();
  if (!normalized) return "";
  const lowered = normalized.toLowerCase();
  if (lowered === "undefined" || lowered === "null") return "";
  return normalized;
};

const resolveEnv = (publicValue?: string, privateValue?: string) =>
  normalizeEnvValue(publicValue) || normalizeEnvValue(privateValue) || "";

const firebaseConfig = {
  apiKey: resolveEnv(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    process.env.FIREBASE_API_KEY,
  ),
  authDomain: resolveEnv(
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    process.env.FIREBASE_AUTH_DOMAIN,
  ),
  projectId: resolveEnv(
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    process.env.FIREBASE_PROJECT_ID,
  ),
  storageBucket: resolveEnv(
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    process.env.FIREBASE_STORAGE_BUCKET,
  ),
  messagingSenderId: resolveEnv(
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    process.env.FIREBASE_MESSAGING_SENDER_ID,
  ),
  appId: resolveEnv(
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    process.env.FIREBASE_APP_ID,
  ),
  measurementId: resolveEnv(
    process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    process.env.FIREBASE_MEASUREMENT_ID,
  ),
};

const getMissingKeys = () => {
  const requiredKeys = {
    NEXT_PUBLIC_FIREBASE_API_KEY: firebaseConfig.apiKey,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: firebaseConfig.authDomain,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: firebaseConfig.projectId,
    NEXT_PUBLIC_FIREBASE_APP_ID: firebaseConfig.appId,
  } as const;

  return Object.entries(requiredKeys)
    .filter(([, value]) => !value)
    .map(([key]) => key);
};

const missingRequiredKeys = getMissingKeys();

export const isFirebaseConfigured = missingRequiredKeys.length === 0;

let firebaseApp = null;

if (isFirebaseConfigured) {
  firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
}

export const auth = firebaseApp ? getAuth(firebaseApp) : null;
export const db = firebaseApp ? getFirestore(firebaseApp) : null;

export function assertFirebaseConfigured() {
  if (!isFirebaseConfigured || !auth || !db) {
    const missing =
      missingRequiredKeys.length > 0
        ? missingRequiredKeys.join(", ")
        : "unknown";
    throw new Error(
      `Firebase is not configured. Missing one or more env vars: ${missing}`,
    );
  }
}
