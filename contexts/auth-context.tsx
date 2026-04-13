"use client";

import { createContext, useEffect, useState, useCallback } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { isPapsEmail, getUserRole } from "@/lib/auth-utils";
import type { AppUser, UserRole } from "@/types/auth";

interface AuthContextValue {
  user: AppUser | null;
  firebaseUser: User | null;
  role: UserRole;
  loading: boolean;
  error: string | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  firebaseUser: null,
  role: "student",
  loading: true,
  error: null,
  signIn: async () => {},
  signOut: async () => {},
});

const provider = new GoogleAuthProvider();
provider.setCustomParameters({ hd: "paps.net" });

async function resolveUserRole(uid: string, email: string | null): Promise<UserRole> {
  try {
    const snap = await getDoc(doc(db, "students", uid));
    if (snap.exists()) {
      const data = snap.data();
      if (data?.role === "teacher") return "teacher";
      if (data?.role === "admin") return "admin";
      if (data?.role === "student") return "student";
      // Doc exists but has no role — heuristic result wins AND gets persisted
      // so future reads are fast and Luke can manually override in Firestore.
      const resolved = getUserRole(email);
      try {
        await setDoc(
          doc(db, "students", uid),
          { role: resolved, updatedAt: serverTimestamp() },
          { merge: true }
        );
      } catch {
        // Non-fatal: client still sees the resolved role in memory this session.
      }
      return resolved;
    }
  } catch {
    // Fall back to email heuristic if Firestore read fails
  }
  return getUserRole(email);
}

function mapFirebaseUser(fbUser: User): AppUser {
  return {
    uid: fbUser.uid,
    email: fbUser.email!,
    displayName: fbUser.displayName || fbUser.email!.split("@")[0],
    role: "student", // placeholder; resolved async in onAuthStateChanged
    photoURL: fbUser.photoURL || undefined,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser && isPapsEmail(fbUser.email)) {
        setFirebaseUser(fbUser);
        // Resolve role BEFORE flipping loading to false so consumers that
        // branch on role (e.g., /admin) don't see the placeholder "student"
        // role during the Firestore round-trip.
        const role = await resolveUserRole(fbUser.uid, fbUser.email);
        setUser({ ...mapFirebaseUser(fbUser), role });
        setLoading(false);
      } else {
        setFirebaseUser(null);
        setUser(null);
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  const signIn = useCallback(async () => {
    setError(null);
    try {
      // Try popup first, fall back to redirect on mobile
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        await signInWithRedirect(auth, provider);
        return;
      }
      const result = await signInWithPopup(auth, provider);
      if (!isPapsEmail(result.user.email)) {
        await firebaseSignOut(auth);
        setError("Please sign in with your @paps.net school account.");
      }
    } catch (err: unknown) {
      const firebaseError = err as { code?: string; message?: string };
      if (firebaseError.code === "auth/popup-closed-by-user") return;
      setError(firebaseError.message || "Sign-in failed. Please try again.");
    }
  }, []);

  const signOut = useCallback(async () => {
    await firebaseSignOut(auth);
    setUser(null);
    setFirebaseUser(null);
  }, []);

  const role = user?.role ?? "student";

  return (
    <AuthContext.Provider value={{ user, firebaseUser, role, loading, error, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
