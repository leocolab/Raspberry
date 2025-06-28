import {
  auth, googleProvider,
  signInWithPopup, createUserWithEmailAndPassword,
  signInWithEmailAndPassword, signOut
} from '@/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthCtx = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() =>
    onAuthStateChanged(auth, u => { setUser(u); setLoading(false); }),
  []);

  /* helpers */
  const googleLogin = () => signInWithPopup(auth, googleProvider);
  const emailSignup = (e, p) => createUserWithEmailAndPassword(auth, e, p);
  const emailLogin  = (e, p) => signInWithEmailAndPassword(auth, e, p);
  const logout      = () => signOut(auth);

  return (
    <AuthCtx.Provider value={{ user, loading, googleLogin, emailSignup, emailLogin, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);