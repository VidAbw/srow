"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { FirebaseHealthChecker, withRetry, handleFirebaseError } from "@/lib/firebaseHealth";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  checkingAdmin: boolean;
  firebaseHealthy: boolean;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  checkingAdmin: true,
  firebaseHealthy: true,
  refreshUser: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [firebaseHealthy, setFirebaseHealthy] = useState(true);

  // ✅ FIX: Firebase health checker instance
  const healthChecker = FirebaseHealthChecker.getInstance();

  // ✅ FIX: Memoize admin check function with retry logic
  const checkAdminStatus = useCallback(async (uid: string) => {
    if (!uid) return;
    
    setCheckingAdmin(true);
    try {
      // Use retry logic for admin check
      const userRef = doc(db, "users", uid);
      const userSnap = await withRetry(() => getDoc(userRef));
      
      if (userSnap.exists()) {
        const userData = userSnap.data();
        setIsAdmin(userData?.role === "admin");
      } else {
        setIsAdmin(false);
      }
    } catch (error: any) {
      console.error("Error checking admin status:", error);
      
      // Handle blocked connections gracefully
      if (error.message && error.message.includes('ERR_BLOCKED_BY_CLIENT')) {
        console.warn("Firebase connection blocked - admin check failed");
        // Don't set admin status to false for blocked connections
        // Let the user try again when connection is restored
      } else {
        setIsAdmin(false);
      }
    } finally {
      setCheckingAdmin(false);
    }
  }, []);

  // ✅ FIX: Check Firebase health periodically
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const isHealthy = await healthChecker.checkHealth();
        setFirebaseHealthy(isHealthy);
      } catch (error) {
        console.warn("Health check failed:", error);
        setFirebaseHealthy(false);
      }
    };

    // Initial health check
    checkHealth();

    // Set up periodic health checks
    const healthInterval = setInterval(checkHealth, 30000);

    return () => clearInterval(healthInterval);
  }, [healthChecker]);

  // ✅ FIX: Separate useEffect for auth state with better error handling
  useEffect(() => {
    let unsubscribe: () => void;
    let mounted = true;
    
    const initAuth = async () => {
      try {
        unsubscribe = onAuthStateChanged(auth, async (user) => {
          if (!mounted) return;
          
          setUser(user);
          
          if (user) {
            // Check admin status after user is set
            await checkAdminStatus(user.uid);
          } else {
            setIsAdmin(false);
            setCheckingAdmin(false);
          }
          
          if (mounted) {
            setLoading(false);
          }
        });
      } catch (error) {
        console.error("Auth initialization error:", error);
        
        // Handle blocked connections
        if (error.message && error.message.includes('ERR_BLOCKED_BY_CLIENT')) {
          console.warn("Firebase connection blocked during auth initialization");
          // Set loading to false so UI can render
          if (mounted) {
            setLoading(false);
          }
        } else {
          if (mounted) {
            setLoading(false);
          }
        }
      }
    };

    initAuth();

    return () => {
      mounted = false;
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [checkAdminStatus]);

  // ✅ FIX: Add refresh function for manual updates with retry logic
  const refreshUser = useCallback(async () => {
    if (user) {
      try {
        await checkAdminStatus(user.uid);
      } catch (error) {
        console.error("Error refreshing user:", error);
        // Handle blocked connections gracefully
        if (error.message && error.message.includes('ERR_BLOCKED_BY_CLIENT')) {
          console.warn("Firebase connection blocked during user refresh");
        }
      }
    }
  }, [user, checkAdminStatus]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      isAdmin, 
      checkingAdmin, 
      firebaseHealthy,
      refreshUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
}