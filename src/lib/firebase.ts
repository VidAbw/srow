import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: "srow-9c28d.firebaseapp.com",
  databaseURL: "https://srow-9c28d-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "srow-9c28d",
  storageBucket: "srow-9c28d.appspot.com",
  messagingSenderId: "341001398303",
  appId: "1:341001398303:web:3ce268a10307c219ea8d2a",
  measurementId: "G-K6GJHK21FG"
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

