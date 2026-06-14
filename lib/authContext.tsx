"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import {
  getAdditionalUserInfo,
  GoogleAuthProvider,
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  getIdToken,
  onAuthStateChanged,
  signInWithCustomToken,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { assertFirebaseConfigured, auth, db } from "@/lib/firebase";

declare global {
  interface Window {
    ethereum?: {
      request: (args: {
        method: string;
        params?: unknown[];
      }) => Promise<unknown>;
    };
  }
}

export type UserAuthType = "wallet" | "email" | "google" | null;

export interface User {
  id: string;
  address?: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  authType: UserAuthType;
  token: string;
  createdAt: number;
}

type ActivityMetadataValue =
  | string
  | number
  | boolean
  | null
  | ActivityMetadataValue[]
  | { [key: string]: ActivityMetadataValue };

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  loginWithWallet: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  signupWithEmail: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  signupWithGoogle: () => Promise<void>;
  trackActivity: (
    type: string,
    metadata?: Record<string, unknown>,
  ) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mapAuthErrorMessage = (err: unknown, fallback: string) => {
  if (err && typeof err === "object" && "code" in err) {
    const code = String((err as { code?: unknown }).code || "");

    if (code === "auth/unauthorized-domain") {
      return "Google sign-in failed: current domain is not authorized in Firebase Auth. Add this domain in Firebase Console > Authentication > Settings > Authorized domains.";
    }

    if (code === "auth/popup-blocked") {
      return "Google sign-in popup was blocked. Allow popups for this site and try again.";
    }

    if (code === "auth/popup-closed-by-user") {
      return "Google sign-in popup was closed before completing authentication.";
    }

    if (code === "auth/cancelled-popup-request") {
      return "Another sign-in popup is already open. Complete or close it and retry.";
    }

    if (code === "auth/operation-not-allowed") {
      return "Google sign-in is not enabled in Firebase Console. Enable Google provider in Authentication > Sign-in method.";
    }

    if (code === "auth/app-not-authorized") {
      return "This app is not authorized for Firebase Authentication. Verify API key and authorized domains in Firebase Console.";
    }

    if (code === "auth/invalid-api-key") {
      return "Firebase API key is invalid. Check NEXT_PUBLIC_FIREBASE_API_KEY in your environment settings.";
    }

    if (code === "auth/network-request-failed") {
      return "Network error during Google sign-in. Check internet/VPN/firewall and try again.";
    }
  }

  if (err instanceof Error && err.message) {
    return err.message;
  }

  return fallback;
};

const ACTIVITY_SESSION_STORAGE_KEY = "finmindai:activity-session-id";

const buildSecureSessionSuffix = () => {
  if (typeof window !== "undefined" && window.crypto?.getRandomValues) {
    const bytes = new Uint8Array(8);
    window.crypto.getRandomValues(bytes);
    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(
      "",
    );
  }

  // Fallback keeps deterministic uniqueness when secure APIs are unavailable.
  return `${Date.now().toString(16)}-${performance.now().toString(16).replace(".", "")}`;
};

const sanitizeTrackedPath = (
  pathname: string,
  search: string,
  hash: string,
) => {
  try {
    if (typeof window === "undefined") {
      return null;
    }

    const normalizedUrl = new URL(
      `${pathname}${search}${hash}`,
      window.location.origin,
    );
    return `${normalizedUrl.pathname}${normalizedUrl.search}`.slice(0, 1024);
  } catch {
    return null;
  }
};

const getSanitizedPathname = (pathname: string) => {
  try {
    if (typeof window === "undefined") {
      return pathname;
    }

    return new URL(pathname, window.location.origin).pathname;
  } catch {
    return pathname;
  }
};

const sanitizeTrackedReferrer = (referrer: string) => {
  if (!referrer) {
    return null;
  }

  try {
    const normalizedUrl = new URL(referrer);
    if (
      normalizedUrl.protocol !== "https:" &&
      normalizedUrl.protocol !== "http:"
    ) {
      return null;
    }

    return `${normalizedUrl.origin}${normalizedUrl.pathname}${normalizedUrl.search}`.slice(
      0,
      1024,
    );
  } catch {
    return null;
  }
};

const sanitizeNavigatorString = (value: string | undefined): string | null => {
  if (!value) {
    return null;
  }

  try {
    const sanitized = value.replace(/[^\w\s.-]/g, "").slice(0, 256);
    return sanitized || null;
  } catch {
    return null;
  }
};

const sanitizeActivityValue = (
  value: unknown,
): ActivityMetadataValue | undefined => {
  if (value === null) {
    return null;
  }

  if (typeof value === "string") {
    return value.slice(0, 2000);
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : undefined;
  }

  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "bigint") {
    return value.toString();
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => sanitizeActivityValue(item))
      .filter((item): item is ActivityMetadataValue => item !== undefined);
  }

  if (typeof value === "object") {
    const sanitizedEntries = Object.entries(value as Record<string, unknown>)
      .slice(0, 40)
      .map(([key, item]) => [key, sanitizeActivityValue(item)] as const)
      .filter(([, item]) => item !== undefined);

    return Object.fromEntries(sanitizedEntries) as {
      [key: string]: ActivityMetadataValue;
    };
  }

  return undefined;
};

const sanitizeActivityMetadata = (metadata: Record<string, unknown>) => {
  const sanitized = sanitizeActivityValue(metadata);

  if (!sanitized || Array.isArray(sanitized) || typeof sanitized !== "object") {
    return {} as { [key: string]: ActivityMetadataValue };
  }

  return sanitized as { [key: string]: ActivityMetadataValue };
};

const getActivitySessionId = () => {
  if (typeof window === "undefined") {
    return "server-session";
  }

  try {
    const existingSessionId = window.sessionStorage.getItem(
      ACTIVITY_SESSION_STORAGE_KEY,
    );
    if (existingSessionId) {
      return existingSessionId;
    }

    const generatedSessionId =
      typeof window.crypto?.randomUUID === "function"
        ? window.crypto.randomUUID()
        : `session-${Date.now()}-${buildSecureSessionSuffix()}`;

    window.sessionStorage.setItem(
      ACTIVITY_SESSION_STORAGE_KEY,
      generatedSessionId,
    );
    return generatedSessionId;
  } catch {
    return `session-${Date.now()}-${buildSecureSessionSuffix()}`;
  }
};

const getActivityContext = () => {
  if (typeof window === "undefined") {
    return {
      path: null,
      fullPath: null,
      referrer: null,
      sessionId: getActivitySessionId(),
      language: null,
      userAgent: null,
      viewport: null,
      screen: null,
    };
  }

  const fullPath = sanitizeTrackedPath(
    window.location.pathname,
    window.location.search,
    window.location.hash,
  );

  return {
    path: getSanitizedPathname(window.location.pathname),
    fullPath,
    referrer: sanitizeTrackedReferrer(document.referrer),
    sessionId: getActivitySessionId(),
    language: sanitizeNavigatorString(navigator.language),
    userAgent: sanitizeNavigatorString(navigator.userAgent),
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
    screen: {
      width: window.screen.width,
      height: window.screen.height,
    },
  };
};

const deriveAuthType = (
  firebaseUser: FirebaseUser,
  profileAuthType?: string,
): UserAuthType => {
  if (
    profileAuthType === "wallet" ||
    profileAuthType === "google" ||
    profileAuthType === "email"
  ) {
    return profileAuthType;
  }

  if (firebaseUser.uid.startsWith("wallet_")) {
    return "wallet";
  }

  const hasGoogleProvider = firebaseUser.providerData.some(
    (provider) => provider.providerId === GoogleAuthProvider.PROVIDER_ID,
  );
  if (hasGoogleProvider) {
    return "google";
  }

  return "email";
};

const getProfileAuthType = async (uid: string): Promise<string | undefined> => {
  if (!db) return undefined;
  try {
    const snap = await getDoc(doc(db, "users", uid));
    if (!snap.exists()) return undefined;
    return snap.data().authType;
  } catch (err) {
    if (isPermissionDeniedError(err)) {
      return undefined;
    }
    throw err;
  }
};

const getUserProfile = async (uid: string) => {
  if (!db) return null;
  try {
    const snap = await getDoc(doc(db, "users", uid));
    return snap.exists() ? snap.data() : null;
  } catch (err) {
    if (isPermissionDeniedError(err)) {
      return null;
    }
    throw err;
  }
};

const isPermissionDeniedError = (err: unknown) => {
  if (err && typeof err === "object" && "code" in err) {
    const code = String((err as { code?: unknown }).code || "");
    if (code.includes("permission-denied")) {
      return true;
    }
  }

  if (err instanceof Error) {
    return err.message
      .toLowerCase()
      .includes("missing or insufficient permissions");
  }

  return false;
};

const isAlreadyExistsError = (err: unknown) => {
  if (err && typeof err === "object" && "code" in err) {
    const code = String((err as { code?: unknown }).code || "");
    if (code.includes("already-exists")) {
      return true;
    }
  }

  if (err instanceof Error) {
    return err.message.toLowerCase().includes("document already exists");
  }

  return false;
};

const upsertUserProfile = async (
  firebaseUser: FirebaseUser,
  authType: UserAuthType,
  walletAddress?: string,
) => {
  if (!db) return;

  const userRef = doc(db, "users", firebaseUser.uid);
  const existingProfile = await getUserProfile(firebaseUser.uid);

  await setDoc(
    userRef,
    {
      uid: firebaseUser.uid,
      email: firebaseUser.email || null,
      displayName: firebaseUser.displayName || null,
      photoURL: firebaseUser.photoURL || null,
      ...(walletAddress ? { walletAddress } : {}),
      authType,
      updatedAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
      ...(existingProfile ? {} : { createdAt: serverTimestamp() }),
    },
    { merge: true },
  );
};

const upsertUserProfileSafely = async (
  firebaseUser: FirebaseUser,
  authType: UserAuthType,
  walletAddress?: string,
) => {
  try {
    await upsertUserProfile(firebaseUser, authType, walletAddress);
  } catch (err) {
    if (isPermissionDeniedError(err)) {
      return;
    }
    throw err;
  }
};

const trackActivityByUid = async (
  uid: string,
  authType: UserAuthType,
  type: string,
  metadata: Record<string, unknown> = {},
) => {
  if (!db) return;

  const context = getActivityContext();
  const activityRef = doc(collection(db, "users", uid, "activity"));

  // Use setDoc with generated ref to keep retries idempotent.
  await setDoc(
    activityRef,
    {
      type,
      authType,
      path: context.path,
      fullPath: context.fullPath,
      referrer: context.referrer,
      sessionId: context.sessionId,
      language: context.language,
      userAgent: context.userAgent,
      viewport: context.viewport,
      screen: context.screen,
      metadata: sanitizeActivityMetadata(metadata),
      createdAt: serverTimestamp(),
    },
    { merge: true },
  );

  await setDoc(
    doc(db, "users", uid),
    {
      lastActivityAt: serverTimestamp(),
      lastActivityType: type,
      lastActivityPath: context.path,
    },
    { merge: true },
  );
};

const trackActivityByUidSafely = async (
  uid: string,
  authType: UserAuthType,
  type: string,
  metadata: Record<string, unknown> = {},
) => {
  try {
    await trackActivityByUid(uid, authType, type, metadata);
  } catch (err) {
    if (isPermissionDeniedError(err) || isAlreadyExistsError(err)) {
      return;
    }
    throw err;
  }
};

const buildUserFromFirebase = async (
  firebaseUser: FirebaseUser,
): Promise<User> => {
  const profileAuthType = await getProfileAuthType(firebaseUser.uid);
  const authType = deriveAuthType(firebaseUser, profileAuthType);

  return {
    id: firebaseUser.uid,
    address: firebaseUser.uid.startsWith("wallet_")
      ? `0x${firebaseUser.uid.slice(7)}`
      : undefined,
    email: firebaseUser.email || undefined,
    displayName: firebaseUser.displayName || undefined,
    photoURL: firebaseUser.photoURL || undefined,
    authType,
    token: await getIdToken(firebaseUser),
    createdAt: Date.now(),
  };
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        assertFirebaseConfigured();
      } catch (err) {
        if (!mounted) return;
        const errorMessage =
          err instanceof Error ? err.message : "Firebase is not configured.";
        setError(errorMessage);
        setIsLoading(false);
        return;
      }

      if (!auth) {
        if (!mounted) return;
        setError("Firebase Auth is unavailable.");
        setIsLoading(false);
        return;
      }

      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (!mounted) return;
        setIsLoading(true);
        try {
          if (!firebaseUser) {
            setUser(null);
            return;
          }
          const normalizedUser = await buildUserFromFirebase(firebaseUser);
          setUser(normalizedUser);
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : "Failed to restore session";
          setError(errorMessage);
          setUser(null);
        } finally {
          setIsLoading(false);
        }
      });

      return unsubscribe;
    };

    let unsubscribe: (() => void) | undefined;
    initializeAuth().then((unsub) => {
      if (mounted) unsubscribe = unsub;
    });

    return () => {
      mounted = false;
      unsubscribe?.();
    };
  }, []);

  const loginWithWallet = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      assertFirebaseConfigured();

      if (!auth) {
        throw new Error("Firebase Auth is unavailable.");
      }

      if (!window.ethereum) {
        throw new Error("MetaMask is not installed. Please install it first.");
      }

      const accounts = (await window.ethereum.request({
        method: "eth_requestAccounts",
      })) as string[];

      if (!accounts?.length) {
        throw new Error("No wallet account found.");
      }

      const address = accounts[0];

      const nonceResponse = await fetch("/api/auth/wallet-nonce", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });

      const noncePayload = await nonceResponse.json();

      if (!nonceResponse.ok) {
        throw new Error(
          noncePayload?.error?.message ||
            noncePayload?.message ||
            "Failed to start wallet authentication",
        );
      }

      const nonceData = (noncePayload?.data ?? noncePayload) as {
        message?: string;
      };
      const message = nonceData?.message;

      if (!message) {
        throw new Error("Wallet nonce message missing from server response");
      }

      const signature = (await window.ethereum.request({
        method: "personal_sign",
        params: [message, address],
      })) as string;

      const verifyResponse = await fetch("/api/auth/wallet-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, signature }),
      });

      const verifyPayload = await verifyResponse.json();

      if (!verifyResponse.ok) {
        throw new Error(
          verifyPayload?.error?.message ||
            verifyPayload?.message ||
            "Wallet verification failed",
        );
      }

      const verifyData = (verifyPayload?.data ?? verifyPayload) as {
        customToken?: string;
      };
      if (!verifyData?.customToken) {
        throw new Error(
          "Wallet verification token missing from server response",
        );
      }

      const credential = await signInWithCustomToken(
        auth,
        verifyData.customToken,
      );

      // Fire-and-forget: Update profile and track activity in background
      // Don't await these - let user redirect immediately
      upsertUserProfileSafely(
        credential.user,
        "wallet",
        address.toLowerCase(),
      ).catch(() => {
        // Profile update failed - continue with auth
      });

      trackActivityByUidSafely(
        credential.user.uid,
        "wallet",
        "auth_wallet_login",
        {
          walletAddress: address.toLowerCase(),
        },
      ).catch(() => {
        // Activity tracking failed - continue with auth
      });
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Wallet login failed";
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginWithEmail = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      setError(null);

      try {
        assertFirebaseConfigured();

        if (!auth) {
          throw new Error("Firebase Auth is unavailable.");
        }

        const credential = await signInWithEmailAndPassword(
          auth,
          email,
          password,
        );
        const existingProfile = await getUserProfile(credential.user.uid);

        if (!existingProfile) {
          await signOut(auth);
          throw new Error(
            "This account is not registered. Please sign up first.",
          );
        }

        // Fire-and-forget: Update profile and track activity in background
        upsertUserProfileSafely(credential.user, "email").catch(() => {
          // Profile update failed - continue with auth
        });

        trackActivityByUidSafely(
          credential.user.uid,
          "email",
          "auth_email_login",
          {
            email: credential.user.email || email,
          },
        ).catch(() => {
          // Activity tracking failed - continue with auth
        });
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Email login failed";
        setError(errorMsg);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const signupWithEmail = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      setError(null);

      try {
        assertFirebaseConfigured();

        if (!auth) {
          throw new Error("Firebase Auth is unavailable.");
        }

        const credential = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );

        // Fire-and-forget: Update profile and track activity in background
        upsertUserProfileSafely(credential.user, "email").catch(() => {
          // Profile update failed - continue with auth
        });

        trackActivityByUidSafely(
          credential.user.uid,
          "email",
          "auth_email_signup",
          {
            email: credential.user.email || email,
          },
        ).catch(() => {
          // Activity tracking failed - continue with auth
        });
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Signup failed";
        setError(errorMsg);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const openGooglePopup = useCallback(async () => {
    assertFirebaseConfigured();

    if (!auth) {
      throw new Error("Firebase Auth is unavailable.");
    }

    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    return signInWithPopup(auth, provider);
  }, []);

  const loginWithGoogle = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const authInstance = auth;
      if (!authInstance) {
        throw new Error("Firebase Auth is unavailable.");
      }

      const credential = await openGooglePopup();
      const existingProfile = await getUserProfile(credential.user.uid);

      if (!existingProfile) {
        await signOut(authInstance);
        throw new Error(
          "This Google account is not registered. Please sign up first.",
        );
      }

      // Fire-and-forget: Update profile and track activity in background
      upsertUserProfileSafely(credential.user, "google").catch(() => {
        // Profile update failed - continue with auth
      });

      trackActivityByUidSafely(
        credential.user.uid,
        "google",
        "auth_google_login",
        { method: "popup" },
      ).catch(() => {
        // Activity tracking failed - continue with auth
      });
    } catch (err) {
      const errorMsg = mapAuthErrorMessage(err, "Google sign-in failed");
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [openGooglePopup]);

  const signupWithGoogle = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const credential = await openGooglePopup();
      const additionalUserInfo = getAdditionalUserInfo(credential);

      // Fire-and-forget: Update profile and track activity in background
      upsertUserProfileSafely(credential.user, "google").catch(() => {
        // Profile update failed - continue with auth
      });

      trackActivityByUidSafely(
        credential.user.uid,
        "google",
        additionalUserInfo?.isNewUser
          ? "auth_google_signup"
          : "auth_google_signup_existing_user",
        { email: credential.user.email || null, method: "popup" },
      ).catch(() => {
        // Activity tracking failed - continue with auth
      });
    } catch (err) {
      const errorMsg = mapAuthErrorMessage(err, "Google sign-up failed");
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [openGooglePopup]);

  const trackActivity = useCallback(
    async (type: string, metadata: Record<string, unknown> = {}) => {
      if (!user) return;

      try {
        await trackActivityByUidSafely(user.id, user.authType, type, metadata);
      } catch {
        // Activity logging failed - continue silently
      }
    },
    [user],
  );

  const logout = useCallback(() => {
    setError(null);

    if (!auth) {
      setUser(null);
      return;
    }

    if (user) {
      void trackActivityByUidSafely(user.id, user.authType, "auth_logout");
    }

    signOut(auth)
      .then(() => setUser(null))
      .catch((err) => {
        const errorMsg = err instanceof Error ? err.message : "Logout failed";
        setError(errorMsg);
      });
  }, [user]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    loginWithWallet,
    loginWithEmail,
    signupWithEmail,
    loginWithGoogle,
    signupWithGoogle,
    trackActivity,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
