import crypto from 'crypto';
import { adminDb } from '@/lib/firebaseAdmin';
import { log } from '@/lib/logger';

const VERIFICATION_TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

export interface VerificationEmail {
  email: string;
  token: string;
  expiresAt: number;
  createdAt: number;
}

/**
 * Generate secure verification token
 */
export function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Store verification token in Firestore
 */
export async function storeVerificationToken(
  email: string,
  token: string
): Promise<void> {
  try {
    const expiresAt = Date.now() + VERIFICATION_TOKEN_EXPIRY;
    const db = adminDb();
    
    await db.collection('email_verifications').doc(email).set({
      email,
      token,
      expiresAt,
      createdAt: Date.now(),
      verified: false,
    });
    
    log.info('Verification token stored', { email });
  } catch (error) {
    log.error('Failed to store verification token', error);
    throw new Error('Failed to store verification token');
  }
}

/**
 * Verify email token
 */
export async function verifyEmailToken(
  email: string,
  token: string
): Promise<boolean> {
  try {
    const db = adminDb();
    const doc = await db.collection('email_verifications').doc(email).get();
    
    if (!doc.exists) {
      log.warn('Verification token not found', { email });
      return false;
    }
    
    const data = doc.data() as VerificationEmail;
    
    // Check token expiry
    if (Date.now() > data.expiresAt) {
      log.warn('Verification token expired', { email });
      await db.collection('email_verifications').doc(email).delete();
      return false;
    }
    
    // Check token match
    if (data.token !== token) {
      log.warn('Verification token mismatch', { email });
      return false;
    }
    
    // Mark as verified
    await db.collection('email_verifications').doc(email).update({
      verified: true,
      verifiedAt: Date.now(),
    });
    
    log.info('Email verified successfully', { email });
    return true;
  } catch (error) {
    log.error('Failed to verify email token', error);
    throw new Error('Failed to verify email token');
  }
}

/**
 * Check if email is verified
 */
export async function isEmailVerified(email: string): Promise<boolean> {
  try {
    const db = adminDb();
    const doc = await db.collection('email_verifications').doc(email).get();
    
    if (!doc.exists) {
      return false;
    }
    
    const data = doc.data() as VerificationEmail & { verified: boolean };
    return data.verified === true;
  } catch (error) {
    log.error('Failed to check email verification status', error);
    return false;
  }
}

/**
 * Send verification email (mock implementation)
 * In production, integrate with SendGrid, AWS SES, or similar
 */
export async function sendVerificationEmail(
  email: string,
  token: string,
  appUrl: string
): Promise<void> {
  try {
    const verificationUrl = `${appUrl}/auth/verify-email?email=${encodeURIComponent(email)}&token=${token}`;
    
    // TODO: Integrate with email service
    // Example: SendGrid, AWS SES, Resend, etc.
    console.log('Sending verification email to:', email);
    console.log('Verification URL:', verificationUrl);
    
    log.info('Verification email queued', { email });
    
    // In production, uncomment and use actual email provider:
    /*
    const response = await sendgrid.send({
      to: email,
      from: VERIFICATION_EMAIL_FROM,
      subject: 'Verify your FinMindAI email',
      html: `
        <h2>Email Verification</h2>
        <p>Click the link below to verify your email address:</p>
        <a href="${verificationUrl}">Verify Email</a>
        <p>This link expires in 24 hours.</p>
      `,
    });
    
    log.info('Verification email sent', { email, messageId: response[0].headers['x-message-id'] });
    */
  } catch (error) {
    log.error('Failed to send verification email', error);
    throw new Error('Failed to send verification email');
  }
}

/**
 * Resend verification email
 */
export async function resendVerificationEmail(
  email: string,
  appUrl: string
): Promise<void> {
  try {
    // Check if already verified
    if (await isEmailVerified(email)) {
      throw new Error('Email already verified');
    }
    
    // Generate new token
    const token = generateVerificationToken();
    
    // Store token
    await storeVerificationToken(email, token);
    
    // Send email
    await sendVerificationEmail(email, token, appUrl);
    
    log.info('Verification email resent', { email });
  } catch (error) {
    log.error('Failed to resend verification email', error);
    throw error;
  }
}

/**
 * Clean up expired verification tokens
 * Run this periodically (e.g., via scheduled task)
 */
export async function cleanupExpiredTokens(): Promise<number> {
  try {
    const db = adminDb();
    const snapshot = await db
      .collection('email_verifications')
      .where('expiresAt', '<', Date.now())
      .where('verified', '==', false)
      .get();
    
    const batch = db.batch();
    
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    
    log.info('Expired verification tokens cleaned up', {
      count: snapshot.size,
    });
    
    return snapshot.size;
  } catch (error) {
    log.error('Failed to cleanup expired tokens', error);
    return 0;
  }
}
