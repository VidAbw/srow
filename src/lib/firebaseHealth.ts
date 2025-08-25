import { db, auth } from './firebase';
import { doc, getDoc, connectFirestoreEmulator } from 'firebase/firestore';
import { connectAuthEmulator } from 'firebase/auth';
import { useState, useEffect } from 'react';

// ✅ FIX: Enhanced Firebase connection health checker
export class FirebaseHealthChecker {
  private static instance: FirebaseHealthChecker;
  private isHealthy: boolean = true;
  private lastCheck: number = 0;
  private checkInterval: number = 30000; // 30 seconds
  private consecutiveFailures: number = 0;
  private maxFailures: number = 3;

  static getInstance(): FirebaseHealthChecker {
    if (!FirebaseHealthChecker.instance) {
      FirebaseHealthChecker.instance = new FirebaseHealthChecker();
    }
    return FirebaseHealthChecker.instance;
  }

  // Check if Firebase connection is healthy
  async checkHealth(): Promise<boolean> {
    const now = Date.now();
    
    // Don't check too frequently
    if (now - this.lastCheck < this.checkInterval) {
      return this.isHealthy;
    }

    try {
      // Try to access a document to test connection
      const testDoc = doc(db, '_health', 'connection');
      await getDoc(testDoc);
      
      this.isHealthy = true;
      this.consecutiveFailures = 0;
      this.lastCheck = now;
      return true;
    } catch (error: any) {
      console.warn('Firebase connection health check failed:', error);
      
      // Check if it's a blocked connection
      if (this.isBlockedByClient(error)) {
        console.warn('Firebase connection blocked by client (ad blocker, security extension, etc.)');
        this.consecutiveFailures++;
        
        // Only mark as unhealthy after multiple consecutive failures
        if (this.consecutiveFailures >= this.maxFailures) {
          this.isHealthy = false;
        }
      } else {
        // Other connection issues
        this.isHealthy = false;
        this.consecutiveFailures++;
      }
      
      this.lastCheck = now;
      return this.isHealthy;
    }
  }

  // Check if error is due to client blocking
  private isBlockedByClient(error: any): boolean {
    const message = error.message || '';
    const code = error.code || '';
    
    return (
      message.includes('ERR_BLOCKED_BY_CLIENT') ||
      message.includes('net::ERR_BLOCKED_BY_CLIENT') ||
      message.includes('ERR_NETWORK') ||
      message.includes('Route Cancelled') ||
      code === 'unavailable' ||
      code === 'permission-denied' ||
      code === 'cancelled'
    );
  }

  // Get connection status
  getStatus(): { isHealthy: boolean; lastCheck: number; consecutiveFailures: number } {
    return {
      isHealthy: this.isHealthy,
      lastCheck: this.lastCheck,
      consecutiveFailures: this.consecutiveFailures
    };
  }

  // Force a health check
  async forceCheck(): Promise<boolean> {
    this.lastCheck = 0;
    return this.checkHealth();
  }

  // Reset failure count
  resetFailures(): void {
    this.consecutiveFailures = 0;
    this.isHealthy = true;
  }
}

// ✅ FIX: Enhanced connection retry utility with better error handling
export const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: any;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      
      // Check if it's a blocked connection or route cancellation
      if (isRetryableError(error)) {
        console.warn(`Firebase operation failed (attempt ${attempt}/${maxRetries}):`, error.message);
        
        if (attempt < maxRetries) {
          // Exponential backoff with jitter
          const delay = baseDelay * Math.pow(2, attempt - 1) + Math.random() * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
      }
      
      // For other errors, don't retry
      throw error;
    }
  }

  throw lastError;
};

// ✅ FIX: Check if error is retryable
function isRetryableError(error: any): boolean {
  const message = error.message || '';
  const code = error.code || '';
  
  return (
    message.includes('ERR_BLOCKED_BY_CLIENT') ||
    message.includes('net::ERR_BLOCKED_BY_CLIENT') ||
    message.includes('Route Cancelled') ||
    message.includes('Cross-Origin-Opener-Policy') ||
    code === 'unavailable' ||
    code === 'permission-denied' ||
    code === 'cancelled'
  );
}

// ✅ FIX: Firebase connection status hook with better error handling
export const useFirebaseHealth = () => {
  const [isHealthy, setIsHealthy] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  useEffect(() => {
    const checkHealth = async () => {
      setIsChecking(true);
      try {
        const health = await FirebaseHealthChecker.getInstance().checkHealth();
        setIsHealthy(health);
        setLastError(null);
      } catch (error: any) {
        console.error('Health check failed:', error);
        setIsHealthy(false);
        setLastError(error.message);
      } finally {
        setIsChecking(false);
      }
    };

    // Initial check
    checkHealth();

    // Set up periodic checks
    const interval = setInterval(checkHealth, 30000);

    return () => clearInterval(interval);
  }, []);

  return { isHealthy, isChecking, lastError };
};

// ✅ FIX: Enhanced Firebase error handler
export const handleFirebaseError = (error: any): string => {
  if (error.message && error.message.includes('ERR_BLOCKED_BY_CLIENT')) {
    return 'Connection blocked by security software. Please check your ad blocker or security extensions.';
  }
  
  if (error.message && error.message.includes('Route Cancelled')) {
    return 'Navigation was cancelled. Please try again.';
  }
  
  if (error.message && error.message.includes('Cross-Origin-Opener-Policy')) {
    return 'Browser security policy is blocking the operation. Please check your browser settings.';
  }
  
  if (error.code === 'auth/user-not-found') {
    return 'User not found. Please check your email and try again.';
  }
  
  if (error.code === 'auth/wrong-password') {
    return 'Incorrect password. Please try again.';
  }
  
  if (error.code === 'auth/too-many-requests') {
    return 'Too many failed attempts. Please try again later.';
  }
  
  if (error.code === 'auth/network-request-failed') {
    return 'Network error. Please check your internet connection.';
  }
  
  return error.message || 'An unexpected error occurred. Please try again.';
};

// ✅ FIX: Development environment detection
export const isDevelopment = (): boolean => {
  return process.env.NODE_ENV === 'development';
};

// ✅ FIX: Enable Firebase emulators in development
export const setupFirebaseEmulators = () => {
  if (isDevelopment() && process.env.NEXT_PUBLIC_USE_EMULATORS === 'true') {
    try {
      // Connect to Firestore emulator
      connectFirestoreEmulator(db, 'localhost', 8080);
      
      // Connect to Auth emulator
      connectAuthEmulator(auth, 'http://localhost:9099');
      
      console.log('✅ Firebase emulators connected');
    } catch (error) {
      console.warn('⚠️ Firebase emulator connection failed:', error);
    }
  }
};

// ✅ FIX: Connection recovery utility
export const attemptConnectionRecovery = async (): Promise<boolean> => {
  try {
    const healthChecker = FirebaseHealthChecker.getInstance();
    await healthChecker.forceCheck();
    
    if (healthChecker.getStatus().isHealthy) {
      console.log('✅ Firebase connection recovered');
      return true;
    }
    
    // Try to reset the connection
    healthChecker.resetFailures();
    await healthChecker.forceCheck();
    
    return healthChecker.getStatus().isHealthy;
  } catch (error) {
    console.error('Connection recovery failed:', error);
    return false;
  }
};

// Auto-setup emulators in development
if (typeof window !== 'undefined') {
  setupFirebaseEmulators();
}
