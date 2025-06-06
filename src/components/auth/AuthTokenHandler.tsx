"use client";

import { useEffect } from "react";
import { onIdTokenChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import nookies from "nookies";

export default function AuthTokenHandler({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (!user) {
        // Clear token if user is not authenticated
        nookies.destroy(null, "token");
        nookies.set(null, "token", "", { path: "/" });
        return;
      }
      
      // Get token when user is authenticated
      const token = await user.getIdToken();
      
      // Set token as cookie
      nookies.destroy(null, "token");
      nookies.set(null, "token", token, { path: "/" });    });

    return () => unsubscribe();
  }, []);

  return <>{children}</>;
}
