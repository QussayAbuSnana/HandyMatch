"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "./firebase";
import { UserProfile, UserRole } from "./types";

interface AuthContextValue {
  /** Firebase Auth user — null while loading or signed out */
  user: User | null;
  /** Firestore profile document — null until loaded */
  userProfile: UserProfile | null;
  /** True while the initial auth state is being resolved */
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (
    email: string,
    password: string,
    displayName: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  updateUserRole: (role: UserRole) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  /** Re-fetch the Firestore profile so context reflects recent edits */
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch or create the Firestore user document
  const fetchUserProfile = useCallback(async (firebaseUser: User) => {
    const ref = doc(db, "users", firebaseUser.uid);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      setUserProfile(snap.data() as UserProfile);
    } else {
      // First time — build profile locally, write it, set state immediately (no second read)
      const newProfile: UserProfile = {
        uid: firebaseUser.uid,
        email: firebaseUser.email ?? "",
        displayName: firebaseUser.displayName ?? "",
        role: null,
        photoURL: firebaseUser.photoURL ?? undefined,
        createdAt: serverTimestamp() as unknown as import("firebase/firestore").Timestamp,
      };
      await setDoc(ref, newProfile);
      setUserProfile(newProfile);
    }
  }, []);

  // Listen to Firebase Auth state
  useEffect(() => {
    // Safety timeout — if Firebase doesn't respond in 5s, stop loading
    const timeout = setTimeout(() => setLoading(false), 5000);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      clearTimeout(timeout);
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          await fetchUserProfile(firebaseUser);
        } catch {
          // Firestore not enabled yet — auth still works
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => {
      clearTimeout(timeout);
      unsubscribe();
    };
  }, [fetchUserProfile]);

  const login = async (email: string, password: string): Promise<User> => {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return credential.user;
  };

  const register = async (
    email: string,
    password: string,
    displayName: string
  ) => {
    const credential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    // Store displayName in Firebase Auth profile
    await updateProfile(credential.user, { displayName });
    // Create Firestore user doc
    const ref = doc(db, "users", credential.user.uid);
    await setDoc(ref, {
      uid: credential.user.uid,
      email,
      displayName,
      role: null,
      createdAt: serverTimestamp(),
    });
    const snap = await getDoc(ref);
    setUserProfile(snap.data() as UserProfile);
  };

  const logout = async () => {
    await signOut(auth);
    setUserProfile(null);
  };

  const updateUserRole = async (role: UserRole) => {
    if (!user) return;
    // Update local state immediately so the UI reacts right away
    setUserProfile((prev) => (prev ? { ...prev, role } : prev));
    // Try to persist to Firestore — silently ignore if not available yet
    try {
      const ref = doc(db, "users", user.uid);
      await setDoc(ref, { role }, { merge: true });
    } catch {
      // Firestore not set up — role is held in memory for this session
    }
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const refreshProfile = async () => {
    if (!user) return;
    try {
      await fetchUserProfile(user);
    } catch {
      // ignore
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        login,
        register,
        logout,
        updateUserRole,
        resetPassword,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}
