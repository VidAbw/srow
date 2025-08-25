import { signInWithEmailAndPassword, signInWithPopup, UserCredential, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, googleProvider, db } from "./firebase";

// ✅ FIX: Add error handling for COOP warnings
const handleCOOPWarning = (error: any) => {
  if (error.message && error.message.includes('Cross-Origin-Opener-Policy')) {
    console.warn('COOP warning detected - this is usually harmless in development');
    return true;
  }
  return false;
};

// ✅ FIX: Add retry logic for blocked connections
const retryOperation = async <T>(
  operation: () => Promise<T>, 
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error: any) {
      // Check if it's a blocked connection error
      if (error.message && (
        error.message.includes('ERR_BLOCKED_BY_CLIENT') ||
        error.message.includes('net::ERR_BLOCKED_BY_CLIENT')
      )) {
        console.warn(`Connection blocked by client (attempt ${i + 1}/${maxRetries})`);
        if (i < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
          continue;
        }
      }
      throw error;
    }
  }
  throw new Error('Max retries exceeded');
};

// Email/Password Login
export const emailLogin = async (email: string, password: string): Promise<UserCredential> => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error: any) {
    if (handleCOOPWarning(error)) {
      // Retry the operation for COOP warnings
      return await retryOperation(() => signInWithEmailAndPassword(auth, email, password));
    }
    console.error("Email login error:", error);
    throw error;
  }
};

// Google Login
export const googleLogin = async (): Promise<UserCredential> => {
  try {
    return await signInWithPopup(auth, googleProvider);
  } catch (error: any) {
    if (handleCOOPWarning(error)) {
      // Retry the operation for COOP warnings
      return await retryOperation(() => signInWithPopup(auth, googleProvider));
    }
    console.error("Google login error:", error);
    throw error;
  }
};

// Check if user is admin
export const isAdmin = async (uid: string): Promise<boolean> => {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await retryOperation(() => getDoc(userRef));
    if (userSnap.exists()) {
      const userData = userSnap.data();
      return userData?.role === "admin";
    }
    return false;
  } catch (error: any) {
    if (handleCOOPWarning(error)) {
      console.warn("COOP warning during admin check - retrying...");
      try {
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          return userData?.role === "admin";
        }
        return false;
      } catch (retryError) {
        console.error("Error during admin check retry:", retryError);
        return false;
      }
    }
    console.error("Error checking admin status:", error);
    return false;
  }
};

// Email/Password Registration
export const registerWithEmail = async (email: string, password: string) => {
  try {
    return await createUserWithEmailAndPassword(auth, email, password);
  } catch (error: any) {
    if (handleCOOPWarning(error)) {
      // Retry the operation for COOP warnings
      return await retryOperation(() => createUserWithEmailAndPassword(auth, email, password));
    }
    console.error("Registration error:", error);
    throw error;
  }
}; 