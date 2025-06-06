/**
 * Utility to validate Firebase environment variables
 */
export function checkFirebaseEnv(): boolean {
  const requiredEnvVars = [
    'FIREBASE_PROJECT_ID',
    'FIREBASE_CLIENT_EMAIL',
    'FIREBASE_PRIVATE_KEY',
  ];
  
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length) {
    console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
    console.error('Please check your .env.local file and make sure all Firebase Admin variables are set correctly.');
    return false;
  }
  
  return true;
}
