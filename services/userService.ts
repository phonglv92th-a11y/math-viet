import { UserProfile } from "../types";
import { db } from "../lib/firebase";
import { doc, getDoc, setDoc, updateDoc, collection, getDocs } from "firebase/firestore";

/**
 * USER SERVICE
 * Quản lý dữ liệu người dùng, tự động chuyển đổi giữa Firebase (Cloud) và LocalStorage (Local)
 */

export const userService = {
  /**
   * Lưu thông tin người dùng (Tạo mới hoặc Cập nhật)
   */
  saveUserProfile: async (user: UserProfile) => {
    // 1. Chế độ Khách hoặc chưa cấu hình Firebase -> Dùng LocalStorage
    if (user.isGuest || !db) {
      if (user.username && !user.isGuest) {
        localStorage.setItem(`mathviet_user_${user.username}`, JSON.stringify(user));
      }
      // Luôn cập nhật profile hiện tại
      localStorage.setItem('mathviet_user_profile', JSON.stringify(user));
      
      console.log(`💾 [Local] Saved user: ${user.name} (${user.isGuest ? 'Guest' : 'Member'})`);
      return;
    }

    // 2. Chế độ Thành viên + Có Firebase -> Lưu lên Cloud Firestore
    try {
      // Sử dụng username làm Document ID để dễ tìm kiếm
      const userRef = doc(db, "users", user.username || user.id);
      await setDoc(userRef, user, { merge: true });
      console.log(`🔥 [Firebase] Saved user to Cloud: ${user.username}`);
    } catch (error) {
      console.error("❌ Error saving user to Firebase:", error);
      // Fallback: Vẫn lưu ở local để user không bị mất data ngay lập tức
      localStorage.setItem('mathviet_user_profile', JSON.stringify(user));
    }
  },

  /**
   * Lấy thông tin người dùng khi đăng nhập
   */
  getUserProfile: async (username: string): Promise<UserProfile | null> => {
    // 1. Ưu tiên lấy từ Firebase nếu có
    if (db) {
      try {
        const userRef = doc(db, "users", username);
        const docSnap = await getDoc(userRef);
        
        if (docSnap.exists()) {
          console.log(`🔥 [Firebase] Fetched user: ${username}`);
          return docSnap.data() as UserProfile;
        }
      } catch (error) {
        console.error("❌ Error fetching user from Firebase:", error);
      }
    }

    // 2. Nếu không có mạng hoặc không tìm thấy trên Cloud, tìm ở LocalStorage
    const localData = localStorage.getItem(`mathviet_user_${username}`);
    if (localData) {
      console.log(`💾 [Local] Fetched user: ${username}`);
      return JSON.parse(localData);
    }

    return null;
  },

  /**
   * ADMIN: Lấy danh sách tất cả người dùng
   */
  getAllUsers: async (): Promise<UserProfile[]> => {
    if (!db) {
      // Giả lập dữ liệu nếu chưa có DB thật
      return [
        { id: 'mock1', name: 'User Giả Lập 1', grade: 5, points: 1200, completedGames: 10, streak: 5, badges: [], friends: [], progress: {}, masteryHighScore: 0, isGuest: false },
        { id: 'mock2', name: 'User Giả Lập 2', grade: 9, points: 8500, completedGames: 50, streak: 12, badges: [], friends: [], progress: {}, masteryHighScore: 0, isGuest: false },
      ];
    }

    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const users: UserProfile[] = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.data() as UserProfile);
      });
      return users;
    } catch (error) {
      console.error("❌ Error fetching all users:", error);
      return [];
    }
  }
};