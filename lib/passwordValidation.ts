import { z } from 'zod';
import { randomInt } from 'crypto';

export interface PasswordStrengthResult {
  score: 0 | 1 | 2 | 3 | 4; // 0 = very weak, 4 = very strong
  feedback: string[];
  meetsRequirements: boolean;
}

/**
 * Password requirements:
 * - Minimum 12 characters
 * - At least 1 uppercase letter
 * - At least 1 lowercase letter
 * - At least 1 number
 * - At least 1 special character
 */
export const passwordSchema = z
  .string()
  .min(12, 'Password must be at least 12 characters long')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/\d/, 'Password must contain at least one number')
  .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, 'Password must contain at least one special character');

/**
 * Common passwords to avoid
 */
const COMMON_PASSWORDS = new Set([
  'password123', 'admin123456', 'letmein123', 'welcome123',
  'monkey123', 'dragon123', 'master123', 'sunshine123',
  'princess123', 'password1234', 'qwerty1234', 'fitness123',
]);

/**
 * Evaluate password strength
 */
export function evaluatePasswordStrength(password: string): PasswordStrengthResult {
  const feedback: string[] = [];
  let score = 0;
  
  // Check minimum length
  if (password.length < 12) {
    feedback.push('Password must be at least 12 characters long');
  } else if (password.length < 16) {
    score++;
    feedback.push('Consider using a longer password (16+ characters)');
  } else {
    score++;
  }
  
  // Check uppercase
  if (!/[A-Z]/.test(password)) {
    feedback.push('Add at least one uppercase letter');
  } else {
    score++;
  }
  
  // Check lowercase
  if (!/[a-z]/.test(password)) {
    feedback.push('Add at least one lowercase letter');
  } else {
    score++;
  }
  
  // Check numbers
  if (!/\d/.test(password)) {
    feedback.push('Add at least one number');
  } else {
    score++;
  }
  
  // Check special characters
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    feedback.push('Add at least one special character');
  } else {
    score++;
  }
  
  // Check for common passwords
  if (COMMON_PASSWORDS.has(password.toLowerCase())) {
    feedback.unshift('This password is too common. Please choose a unique password');
    score = Math.max(0, score - 2);
  }
  
  // Check for repeated characters
  if (/(.)\1{2,}/.test(password)) {
    feedback.push('Avoid repeating characters (e.g., aaa, 111)');
    score = Math.max(0, score - 1);
  }
  
  // Check for sequential characters
  if (/abc|bcd|cde|123|234|345|qwerty|asdf/i.test(password)) {
    feedback.push('Avoid sequential characters');
    score = Math.max(0, score - 1);
  }
  
  // Normalize score to 0-4 range
  const normalizedScore = Math.min(4, Math.max(0, score)) as 0 | 1 | 2 | 3 | 4;
  
  return {
    score: normalizedScore,
    feedback,
    meetsRequirements: feedback.length === 0,
  };
}

/**
 * Validate password meets minimum requirements
 */
export function validatePassword(password: string): { valid: boolean; error?: string } {
  try {
    passwordSchema.parse(password);
    return { valid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        valid: false,
        error: error.errors[0]?.message || 'Invalid password',
      };
    }
    return {
      valid: false,
      error: 'Failed to validate password',
    };
  }
}

/**
 * Get password strength label
 */
export function getPasswordStrengthLabel(score: number): string {
  const labels: Record<number, string> = {
    0: 'Very Weak',
    1: 'Weak',
    2: 'Fair',
    3: 'Good',
    4: 'Strong',
  };
  return labels[score] || 'Unknown';
}

/**
 * Get password strength color (for UI)
 */
export function getPasswordStrengthColor(score: number): string {
  const colors: Record<number, string> = {
    0: '#dc2626', // red
    1: '#ea580c', // orange
    2: '#eab308', // yellow
    3: '#84cc16', // lime
    4: '#16a34a', // green
  };
  return colors[score] || '#9ca3af'; // gray
}

/**
 * Generate secure random password (for password reset scenarios)
 * Uses cryptographically secure randomness (crypto.randomInt)
 */
export function generateSecurePassword(): string {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  let password = '';
  
  // Ensure at least one of each required character type (using cryptographic randomness)
  password += uppercase[randomInt(0, uppercase.length)];
  password += lowercase[randomInt(0, lowercase.length)];
  password += numbers[randomInt(0, numbers.length)];
  password += special[randomInt(0, special.length)];
  
  // Fill remaining length with random characters from all sets
  const allChars = uppercase + lowercase + numbers + special;
  for (let i = password.length; i < 16; i++) {
    password += allChars[randomInt(0, allChars.length)];
  }
  
  // Shuffle password using cryptographic randomness
  const chars = password.split('');
  for (let i = chars.length - 1; i > 0; i--) {
    const j = randomInt(0, i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  
  return chars.join('');
}
