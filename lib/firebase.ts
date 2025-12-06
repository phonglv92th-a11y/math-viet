import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Fix: Cast import.meta to any to resolve TypeScript error "Property 'env' does not exist on type 'ImportMeta'"
const env = (import.meta as any).env;

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

// Kiểm tra xem đã có cấu hình chưa
const isFirebaseConfigured = !!firebaseConfig.apiKey && !!firebaseConfig.projectId;

let app;
let db: any = null;

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log("🔥 Firebase connected successfully!");
  } catch (error) {
    console.error("🔥 Firebase initialization error:", error);
  }
} else {
  console.warn("⚠️ Firebase credentials missing. Falling back to LocalStorage.");
}

export { db };