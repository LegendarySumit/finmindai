import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

export interface AuthenticatedRequest {
  uid?: string;
  email?: string;
}

type AuthRequestLike = {
  headers: {
    authorization?: string;
    get?: (name: string) => string | null;
  };
  uid?: string;
  email?: string;
};

/**
 * Validates Firebase ID token from Authorization header
 * Returns decoded token claims or throws error
 */
export async function verifyAuth(req: AuthRequestLike): Promise<string> {
  const authHeader =
    req.headers.authorization ??
    (typeof req.headers.get === "function"
      ? (req.headers.get("authorization") ?? undefined)
      : undefined);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Missing or invalid Authorization header");
  }

  const token = authHeader.slice(7); // Remove "Bearer " prefix

  try {
    const decodedToken = await adminAuth().verifyIdToken(token);
    req.uid = decodedToken.uid;
    req.email = decodedToken.email;
    return decodedToken.uid;
  } catch (error) {
    const errMsg =
      error instanceof Error ? error.message : "Token verification failed";
    throw new Error(`Unauthorized: ${errMsg}`);
  }
}

/**
 * Middleware-style handler for protecting API routes
 * Usage in API route: const uid = await requireAuth(req);
 */
export async function requireAuth(req: AuthRequestLike): Promise<string> {
  try {
    return await verifyAuth(req);
  } catch (error) {
    throw error; // Caller handles HTTP response
  }
}

/**
 * Check if user has completed profile (exists in Firestore)
 */
export async function requireProfile(uid: string): Promise<boolean> {
  try {
    const userDoc = await adminDb().collection("users").doc(uid).get();
    return userDoc.exists;
  } catch {
    // Error checking profile - fail securely
    return false;
  }
}

/**
 * Get user profile from Firestore
 */
export async function getUserProfile(uid: string) {
  try {
    const userDoc = await adminDb().collection("users").doc(uid).get();
    return userDoc.exists ? userDoc.data() : null;
  } catch {
    // Error fetching profile
    return null;
  }
}

/**
 * Standard error response builder
 */
export function buildErrorResponse(statusCode: number, message: string) {
  return {
    statusCode,
    body: JSON.stringify({ error: message }),
  };
}
