/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut
} from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  error: string | null;
  clearError: () => void;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, firebaseUser => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const wrap = async (fn: () => Promise<unknown>) => {
    setError(null);
    try {
      await fn();
    } catch (err: any) {
      setError(humanizeAuthError(err?.code) ?? "Something went wrong. Please try again.");
      throw err;
    }
  };

  const value: AuthContextValue = {
    user,
    loading,
    error,
    clearError: () => setError(null),
    signInWithEmail: (email, password) => wrap(() => signInWithEmailAndPassword(auth, email, password)),
    signUpWithEmail: (email, password) => wrap(() => createUserWithEmailAndPassword(auth, email, password)),
    signInWithGoogle: () => wrap(() => signInWithPopup(auth, googleProvider)),
    logOut: () => wrap(() => signOut(auth))
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

function humanizeAuthError(code?: string): string | null {
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "That email or password doesn't match our records.";
    case "auth/email-already-in-use":
      return "An account with that email already exists — try signing in instead.";
    case "auth/weak-password":
      return "Choose a password with at least 6 characters.";
    case "auth/invalid-email":
      return "That doesn't look like a valid email address.";
    case "auth/popup-closed-by-user":
      return null;
    default:
      return code ? "Something went wrong. Please try again." : null;
  }
}