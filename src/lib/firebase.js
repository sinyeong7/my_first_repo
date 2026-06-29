import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDHJVAV_XvlHE7XSHG7D8MmYkB1yjVoqPA",
  authDomain: "sy-padlet.firebaseapp.com",
  projectId: "sy-padlet",
  storageBucket: "sy-padlet.firebasestorage.app",
  messagingSenderId: "113986653283",
  appId: "1:113986653283:web:a9bfa674734a8b2ba9fc56",
  measurementId: "G-9YJBG5CWQC"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
