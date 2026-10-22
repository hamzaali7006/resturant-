import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  signInAnonymously,
  type User
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  addDoc,
  serverTimestamp,
  updateDoc
} from 'firebase/firestore';

// The Firebase configuration provided by the user
export const firebaseConfig = {
  apiKey: "AIzaSyAawe53xvHDv_c9iIfHhmp1KU7cg-nsnJQ",
  authDomain: "myresturent-36f45.firebaseapp.com",
  projectId: "myresturent-36f45",
  storageBucket: "myresturent-36f45.firebasestorage.app",
  messagingSenderId: "1007772698967",
  appId: "1:1007772698967:web:84f6ed6c545d202eb51612",
  measurementId: "G-7Y88RGC99Y"
};

// Initialize Firebase safely
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);

export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  signInAnonymously,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  updateDoc
};

export type { User };
