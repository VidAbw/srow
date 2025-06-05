import { 
  signInWithEmailAndPassword,
  signInWithPopup,
  UserCredential
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, googleProvider, db } from "./firebase";
import { GetServerSidePropsContext } from "next";
import nookies from "nookies";
import { firebaseAdmin } from "./firebaseAdmin";

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

// Check if user is admin
export const isAdmin = async (uid: string): Promise<boolean> => {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = userSnap.data();
      return userData?.role === "admin";
    }
    
    return false;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
};

// Protect admin routes
export const protectAdminRoute = async (context: GetServerSidePropsContext) => {
  try {
    // Get auth cookies
    const cookies = nookies.get(context);
    const token = cookies.token;
    
    if (!token) {
      // Redirect to login if no token
      return {
        redirect: {
          destination: "/login?redirect=/admin",
          permanent: false,
        },
      };
    }
    
    // Verify token
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
    const uid = decodedToken.uid;
    
    // Check if user is admin
    const adminStatus = await isAdmin(uid);
    
    if (!adminStatus) {
      // Redirect to home if not admin
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }
    
    // Allow access to admin page
    return {
      props: {
        uid,
      },
    };
  } catch (error) {
    console.error("Admin route protection error:", error);
    
    // Redirect to login on error
    return {
      redirect: {
        destination: "/login?redirect=/admin",
        permanent: false,
      },
    };
  }
};
