import { useRouter } from "next/router";
import { useCallback, useRef } from "react";

export const useSmartNavigation = () => {
  const router = useRouter();
  const isNavigating = useRef(false);
  const navigationTimeout = useRef<NodeJS.Timeout | null>(null);

  const navigateTo = useCallback(async (path: string, options?: any) => {
    if (isNavigating.current) {
      console.log("Navigation already in progress, skipping:", path);
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
      }, 1000);
      
      await router.push(path, undefined, options);
    } catch (error) {
      console.error("Navigation error:", error);
      isNavigating.current = false;
    }
  }, [router]);

  const replaceTo = useCallback(async (path: string, options?: any) => {
    if (isNavigating.current) {
      console.log("Navigation already in progress, skipping:", path);
      return;
    }
    
    isNavigating.current = true;
    
    try {
      if (navigationTimeout.current) {
        clearTimeout(navigationTimeout.current);
      }
      
      navigationTimeout.current = setTimeout(() => {
        isNavigating.current = false;
      }, 1000);
      
      await router.replace(path, undefined, options);
    } catch (error) {
      console.error("Navigation error:", error);
      isNavigating.current = false;
    }
  }, [router]);

  const back = useCallback(() => {
    if (isNavigating.current) {
      console.log("Navigation already in progress, skipping back navigation");
      return;
    }
    
    isNavigating.current = true;
    router.back();
    
    // Reset navigation state after a short delay
    setTimeout(() => {
      isNavigating.current = false;
    }, 500);
  }, [router]);

  return { 
    navigateTo, 
    replaceTo, 
    back,
    isNavigating: isNavigating.current,
    router 
  };
};
