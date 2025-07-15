"use client";
import Header from "./Header";
import { Geist } from "next/font/google";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

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

  useEffect(() => {
    const handleStart = () => {
      setLoading(true);
      setError(null);
    };
    const handleComplete = () => setLoading(false);
    const handleError = (err: Error) => {
      setLoading(false);
      setError("Something went wrong. Please try again.");
      console.error("Navigation error:", err);
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleError);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleError);
    };
  }, [router]);

  return (
    <div className={`${geistSans.variable} min-h-screen bg-white dark:bg-gray-900`}>
      {loading && (
        <div className="fixed top-0 left-0 w-full h-1 bg-blue-500 z-50">
          <div className="h-full bg-blue-600 animate-pulse"></div>
        </div>
      )}
      <Header />
      <main>
        {error && (
          <div className="container mx-auto px-4 py-4">
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded">
              {error}
              <button 
                onClick={() => setError(null)}
                className="ml-2 underline hover:no-underline"
              >
                Dismiss
              </button>
            </div>
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