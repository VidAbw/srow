"use client";

import { emailLogin } from "@/lib/auth.client";
import { useState, useEffect } from "react";
// ✅ FIX: Use navigation guard hook instead of direct router
import { useNavigationGuard } from "@/hooks/useNavigationGuard";
import { useAuth } from "@/components/auth/AuthProvider";

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { navigateTo, replaceTo, isNavigating } = useNavigationGuard();
  const { user, loading } = useAuth();

  // ✅ FIX: Use useEffect for redirects to prevent render conflicts
  useEffect(() => {
    if (user && !loading && !isNavigating) {
      replaceTo("/");
    }
  }, [user, loading, replaceTo, isNavigating]);

  // ✅ FIX: Don't render if loading or already authenticated
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white"></div>
        <span className="ml-2 text-gray-600 dark:text-gray-400">Loading...</span>
      </div>
    );
  }

  if (user) {
    return null; // Will redirect via useEffect
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || isNavigating) return; // Prevent double submission and navigation conflicts
    
    setIsSubmitting(true);
    setError(null);
    
    const form = e.target as HTMLFormElement;
    const email = form.email.value;
    const password = form.password.value;

    try {
      await emailLogin(email, password);
      // ✅ FIX: Use navigation guard for better error handling
      await replaceTo("/");
    } catch (error) {
      console.error("Login failed:", error);
      
      // ✅ FIX: Better error handling for specific error types
      if (error instanceof Error) {
        if (error.message.includes('Cross-Origin-Opener-Policy')) {
          setError("Browser security policy is blocking the login. Please check your browser settings.");
        } else if (error.message.includes('ERR_BLOCKED_BY_CLIENT')) {
          setError("Login blocked by security software. Please check your ad blocker or security extensions.");
        } else {
          setError(error.message);
        }
      } else {
        setError("Invalid email or password");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Email
        </label>
        <input 
          id="email"
          name="email" 
          type="email" 
          placeholder="Enter your email" 
          required 
          disabled={isSubmitting || isNavigating}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-black dark:focus:ring-gray-400 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>
      
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Password
        </label>
        <input 
          id="password"
          name="password" 
          type="password" 
          placeholder="Enter your password" 
          required 
          disabled={isSubmitting || isNavigating}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-black dark:focus:ring-gray-400 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>
      
      {error && (
        <div className="px-4 py-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <div>
        <button 
          type="submit" 
          disabled={isSubmitting || isNavigating}
          className="w-full px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Signing in..." : isNavigating ? "Redirecting..." : "Sign in"}
        </button>
      </div>
      
      <div className="text-center">
        <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white">
          Forgot your password?
        </a>
      </div>
    </form>
  );
}