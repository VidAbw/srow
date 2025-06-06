import * as admin from "firebase-admin";
import { checkFirebaseEnv } from "./checkEnv";

// Initialize Firebase Admin if it hasn't been initialized already
if (!admin.apps.length) {
  try {
    // Validate environment variables before initializing
    if (!checkFirebaseEnv()) {
      throw new Error("Firebase environment variables are missing or invalid");
    }
    
    const privateKey = process.env.FIREBASE_PRIVATE_KEY ? 
      process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n") : 
      undefined;
      
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey
    };
    
    // Log partial service account for debugging (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.log("Firebase Admin Service Account:", {
        projectId: serviceAccount.projectId,
        clientEmail: serviceAccount.clientEmail,
        // Don't log private key
        privateKeyProvided: !!serviceAccount.privateKey
      });
    }
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_PROJECT_ID ? 
        `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com` : 
        undefined,
    });
  } catch (error) {
    console.error("Firebase admin initialization error:", error);
  }
}

export const firebaseAdmin = admin;
