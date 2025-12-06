import * as firebaseApp from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Safe access to environment variables
// Ensure we don't crash if import.meta.env is undefined
const meta = import.meta as any;
const env = meta && meta.env ? meta.env : {};

// Cấu hình Firebase từ biến môi trường (Vercel Environment Variables)
// Bạn lấy các thông tin này từ Firebase Console -> Project Settings -> General -> Your apps -> SDK setup and configuration
const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID
};

// Kiểm tra xem đã có cấu hình chưa (Check if API Key exists)
const isFirebaseConfigured = !!firebaseConfig.apiKey && !!firebaseConfig.projectId;

let app;
let db: any = null;

if (isFirebaseConfigured) {
  try {
    // Access initializeApp from the namespace object to avoid named export issues in some TS configs
    app = firebaseApp.initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log("🔥 Firebase connected successfully!");
  } catch (error) {
    console.error("🔥 Firebase initialization error:", error);
  }
} else {
  // Log warning only in development or if explicitly checking
  // Using console.warn to avoid cluttering production logs if intentionally running offline
  if (env.MODE !== 'production' || !isFirebaseConfigured) {
     console.warn("⚠️ Firebase credentials missing or incomplete. Falling back to LocalStorage.");
  }
}

export { db };