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
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    displayName: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  updateUserRole: (role: UserRole) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
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
      // First time — create a minimal profile
      const profile: Omit<UserProfile, "createdAt"> & {
        createdAt: ReturnType<typeof serverTimestamp>;
      } = {
        uid: firebaseUser.uid,
        email: firebaseUser.email ?? "",
        displayName: firebaseUser.displayName ?? "",
        role: null,
        photoURL: firebaseUser.photoURL ?? undefined,
        createdAt: serverTimestamp() as ReturnType<typeof serverTimestamp>,
      };
      await setDoc(ref, profile);
      // Re-fetch so we get the server timestamp
      const fresh = await getDoc(ref);
      setUserProfile(fresh.data() as UserProfile);
    }
  }, []);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await fetchUserProfile(firebaseUser);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, [fetchUserProfile]);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
    // onAuthStateChanged will handle fetching the profile
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
    const ref = doc(db, "users", user.uid);
    await updateDoc(ref, { role });
    setUserProfile((prev) => (prev ? { ...prev, role } : prev));
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
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
