// src/firebase.ts
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

/* ----------------------------------------------------------
   Firebase config – pull from environment variables so you
   never hard-code keys into your repo
---------------------------------------------------------- */
const firebaseConfig = {
    apiKey: "AIzaSyBPzwLP3zbRZigW2D1z5W3F0tQGZckQYAg",

    authDomain: "raspberry-2dbda.firebaseapp.com",
  
    projectId: "raspberry-2dbda",
  
    storageBucket: "raspberry-2dbda.firebasestorage.app",
  
    messagingSenderId: "236686960923",
  
    appId: "1:236686960923:web:ec151de05e8f0dfbbf0bbe",
  
    measurementId: "G-35PQ26EY6S"
  
};

const app  = initializeApp(firebaseConfig);
export const auth           = getAuth(app);
export const db             = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

/* ---------- helper re-exports (optional) ---------- */
export {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
};