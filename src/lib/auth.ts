import { 
  signInWithEmailAndPassword,
  signInWithPopup,
  UserCredential
} from "firebase/auth";
import { auth, googleProvider } from "./firebase";

// Email/Password Login
export const emailLogin = async (email: string, password: string): Promise<UserCredential> => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error("Email login error:", error);
    throw error;
  }
};

// Google Login
export const googleLogin = async (): Promise<UserCredential> => {
  return await signInWithPopup(auth, googleProvider);
};
