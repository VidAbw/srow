"use client";

import { useState } from "react";
import { attemptConnectionRecovery } from "@/lib/firebaseHealth";

interface ErrorRecoveryProps {
  error: string;
  onRecover?: () => void;
  onDismiss?: () => void;
}

export default function ErrorRecovery({ error, onRecover, onDismiss }: ErrorRecoveryProps) {
  const [isRecovering, setIsRecovering] = useState(false);
  const [showSolutions, setShowSolutions] = useState(false);

  const handleRecovery = async () => {
    if (isRecovering) return;
    
    setIsRecovering(true);
    try {
      const recovered = await attemptConnectionRecovery();
      if (recovered) {
        onRecover?.();
        console.log('✅ Error recovery successful');
      }
    } catch (error) {
      console.error('Recovery attempt failed:', error);
    } finally {
      setIsRecovering(false);
    }
  };

  const getErrorType = (errorMessage: string): 'connection' | 'security' | 'navigation' | 'general' => {
    if (errorMessage.includes('ERR_BLOCKED_BY_CLIENT') || errorMessage.includes('ad blocker')) {
      return 'security';
    }
    if (errorMessage.includes('Cross-Origin-Opener-Policy') || errorMessage.includes('browser security')) {
      return 'security';
    }
    if (errorMessage.includes('Route Cancelled') || errorMessage.includes('navigation')) {
      return 'navigation';
    }
    if (errorMessage.includes('connection') || errorMessage.includes('Firebase')) {
      return 'connection';
    }
    return 'general';
  };

  const getSolutions = (errorType: string) => {
    switch (errorType) {
      case 'security':
        return [
          "Disable ad blockers or security extensions temporarily",
          "Add Firebase domains to your security software whitelist",
          "Check browser privacy and security settings",
          "Try using incognito/private browsing mode"
        ];
      case 'connection':
        return [
          "Check your internet connection",
          "Refresh the page and try again",
          "Clear browser cache and cookies",
          "Try a different browser or device"
        ];
      case 'navigation':
        return [
          "Wait a moment and try again",
          "Refresh the page",
          "Use browser back/forward buttons",
          "Check if the page is still loading"
        ];
      default:
        return [
          "Refresh the page",
          "Clear browser cache",
          "Try again in a few moments",
          "Contact support if the issue persists"
        ];
    }
  };

  const errorType = getErrorType(error);
  const solutions = getSolutions(errorType);

  return (
    <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-red-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
              {errorType === 'security' && 'Security Policy Error'}
              {errorType === 'connection' && 'Connection Error'}
              {errorType === 'navigation' && 'Navigation Error'}
              {errorType === 'general' && 'Error Occurred'}
            </h3>
          </div>
          <p className="mt-1 text-sm text-red-700 dark:text-red-300">
            {error}
          </p>
        </div>
        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={() => setShowSolutions(!showSolutions)}
            className="text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 underline"
          >
            {showSolutions ? 'Hide Solutions' : 'Show Solutions'}
          </button>
          {onRecover && (
            <button
              onClick={handleRecovery}
              disabled={isRecovering}
              className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRecovering ? 'Recovering...' : 'Try Recovery'}
            </button>
          )}
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Dismiss
            </button>
          )}
        </div>
      </div>
      
      {showSolutions && (
        <div className="mt-4 pt-4 border-t border-red-200 dark:border-red-700">
          <h4 className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
            Try these solutions:
          </h4>
          <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
            {solutions.map((solution, index) => (
              <li key={index} className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                {solution}
              </li>
            ))}
          </ul>
          
          {errorType === 'security' && (
            <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded">
              <p className="text-xs text-yellow-800 dark:text-yellow-200">
                <strong>Quick Fix:</strong> Add these domains to your ad blocker whitelist:
                <code className="block mt-1 font-mono text-xs bg-yellow-100 dark:bg-yellow-800 px-2 py-1 rounded">
                  *.firebaseapp.com, *.firestore.googleapis.com, *.googleapis.com
                </code>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
