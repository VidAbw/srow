"use client";
import Header from "./Header";
import { Geist } from "next/font/google";
import { useRouter } from "next/router";
import { useState, useEffect, useCallback } from "react";
import ConnectionStatus from "../ui/ConnectionStatus";
import ErrorRecovery from "../ui/ErrorRecovery";
import { attemptConnectionRecovery } from "@/lib/firebaseHealth";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRecovering, setIsRecovering] = useState(false);

  // ✅ FIX: Better error handling for route cancellation
  const handleError = useCallback((err: Error) => {
    setLoading(false);
    
    // Handle specific error types
    if (err.message.includes('Route Cancelled')) {
      console.warn('Route cancellation detected - this is usually harmless');
      // Don't show error for route cancellations
      return;
    }
    
    if (err.message.includes('Cross-Origin-Opener-Policy')) {
      setError("Browser security policy is blocking navigation. Please check your browser settings.");
      return;
    }
    
    if (err.message.includes('ERR_BLOCKED_BY_CLIENT')) {
      setError("Navigation blocked by security software. Please check your ad blocker or security extensions.");
      return;
    }
    
    // Generic error handling
    setError("Something went wrong. Please try again.");
    console.error("Navigation error:", err);
  }, []);

  // ✅ FIX: Attempt connection recovery
  const handleRecovery = useCallback(async () => {
    if (isRecovering) return;
    
    setIsRecovering(true);
    try {
      const recovered = await attemptConnectionRecovery();
      if (recovered) {
        setError(null);
        console.log('✅ Connection recovered successfully');
      }
    } catch (error) {
      console.error('Recovery attempt failed:', error);
    } finally {
      setIsRecovering(false);
    }
  }, [isRecovering]);

  useEffect(() => {
    const handleStart = () => {
      setLoading(true);
      setError(null);
    };
    
    const handleComplete = () => setLoading(false);
    
    const handleError = (err: Error) => handleError(err);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleError);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleError);
    };
  }, [router, handleError]);

  return (
    <div className={`${geistSans.variable} min-h-screen bg-white dark:bg-gray-900 flex flex-col`}>
      {/* ✅ ADD: Connection status indicator */}
      <ConnectionStatus />
      
      {loading && (
        <div className="fixed top-0 left-0 w-full h-1 bg-blue-500 z-50">
          <div className="h-full bg-blue-600 animate-pulse"></div>
        </div>
      )}
      <Header />
      <main className="flex-1">
        {error && (
          <div className="container mx-auto px-4 py-4">
            <ErrorRecovery 
              error={error}
              onRecover={handleRecovery}
              onDismiss={() => setError(null)}
            />
          </div>
        )}
        {children}
      </main>
      <footer className="border-t border-gray-200 dark:border-gray-800 py-8 mt-auto">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
          <p>© {new Date().getFullYear()} SROW Clothing. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
} 