import { useRouter } from "next/router";
import { useCallback, useRef, useEffect } from "react";

export const useNavigationGuard = () => {
  const router = useRouter();
  const isNavigating = useRef(false);
  const navigationTimeout = useRef<NodeJS.Timeout | null>(null);
  const pendingNavigation = useRef<string | null>(null);

  // ✅ FIX: Prevent multiple simultaneous navigations
  const navigateTo = useCallback(async (path: string, options?: any) => {
    if (isNavigating.current) {
      console.log("Navigation already in progress, queuing:", path);
      pendingNavigation.current = path;
      return;
    }
    
    isNavigating.current = true;
    
    try {
      // Clear any existing timeout
      if (navigationTimeout.current) {
        clearTimeout(navigationTimeout.current);
      }
      
      // Set timeout to reset navigation state
      navigationTimeout.current = setTimeout(() => {
        isNavigating.current = false;
        
        // Process any pending navigation
        if (pendingNavigation.current) {
          const pending = pendingNavigation.current;
          pendingNavigation.current = null;
          navigateTo(pending, options);
        }
      }, 1500);
      
      await router.push(path, undefined, options);
    } catch (error: any) {
      console.error("Navigation error:", error);
      
      // Handle specific error types
      if (error.message && error.message.includes('Route Cancelled')) {
        console.warn("Route cancellation detected - retrying navigation");
        // Retry the navigation after a short delay
        setTimeout(() => {
          isNavigating.current = false;
          navigateTo(path, options);
        }, 100);
        return;
      }
      
      isNavigating.current = false;
      throw error;
    }
  }, [router]);

  const replaceTo = useCallback(async (path: string, options?: any) => {
    if (isNavigating.current) {
      console.log("Navigation already in progress, queuing replace:", path);
      pendingNavigation.current = path;
      return;
    }
    
    isNavigating.current = true;
    
    try {
      if (navigationTimeout.current) {
        clearTimeout(navigationTimeout.current);
      }
      
      navigationTimeout.current = setTimeout(() => {
        isNavigating.current = false;
        
        // Process any pending navigation
        if (pendingNavigation.current) {
          const pending = pendingNavigation.current;
          pendingNavigation.current = null;
          replaceTo(pending, options);
        }
      }, 1500);
      
      await router.replace(path, undefined, options);
    } catch (error: any) {
      console.error("Navigation error:", error);
      
      // Handle specific error types
      if (error.message && error.message.includes('Route Cancelled')) {
        console.warn("Route cancellation detected - retrying replace");
        // Retry the navigation after a short delay
        setTimeout(() => {
          isNavigating.current = false;
          replaceTo(path, options);
        }, 100);
        return;
      }
      
      isNavigating.current = false;
      throw error;
    }
  }, [router]);

  const back = useCallback(() => {
    if (isNavigating.current) {
      console.log("Navigation already in progress, skipping back navigation");
      return;
    }
    
    isNavigating.current = true;
    
    try {
      router.back();
    } catch (error: any) {
      console.error("Back navigation error:", error);
      isNavigating.current = false;
      throw error;
    }
    
    // Reset navigation state after a short delay
    setTimeout(() => {
      isNavigating.current = false;
    }, 500);
  }, [router]);

  // ✅ FIX: Handle route change events
  useEffect(() => {
    const handleStart = () => {
      // Don't set loading state if we're already navigating
      if (!isNavigating.current) {
        isNavigating.current = true;
      }
    };
    
    const handleComplete = () => {
      isNavigating.current = false;
      
      // Process any pending navigation
      if (pendingNavigation.current) {
        const pending = pendingNavigation.current;
        pendingNavigation.current = null;
        setTimeout(() => navigateTo(pending), 100);
      }
    };
    
    const handleError = (error: Error) => {
      isNavigating.current = false;
      
      // Handle route cancellation gracefully
      if (error.message && error.message.includes('Route Cancelled')) {
        console.warn("Route cancellation handled gracefully");
        return;
      }
      
      console.error("Route change error:", error);
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleError);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleError);
    };
  }, [router, navigateTo]);

  // ✅ FIX: Cleanup on unmount
  useEffect(() => {
    return () => {
      if (navigationTimeout.current) {
        clearTimeout(navigationTimeout.current);
      }
    };
  }, []);

  return { 
    navigateTo, 
    replaceTo, 
    back,
    isNavigating: isNavigating.current,
    router,
    // ✅ ADD: Force navigation state reset
    resetNavigation: () => {
      isNavigating.current = false;
      if (navigationTimeout.current) {
        clearTimeout(navigationTimeout.current);
      }
      pendingNavigation.current = null;
    }
  };
};
