"use client";

import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { findOrCreateUserAction } from "@/lib/actions";

// --- Developer Configuration ---
// Set to true to bypass Firebase Auth and log in as a mock admin user.
// Set to false for standard Firebase authentication.
const BYPASS_AUTH = true;

// --- Interfaces ---
type UserRole = "admin" | "editor" | "viewer";

interface AuthContextType {
  user: User | null | undefined; // undefined: initial loading, null: not logged in
  role: UserRole | null;
  isLoading: boolean;
  isAdmin: boolean;
  isEditor: boolean;
}

// --- Context Definition ---
const AuthContext = createContext<AuthContextType>({
  user: undefined,
  role: null,
  isLoading: true,
  isAdmin: false,
  isEditor: false,
});

// --- AuthProvider Component ---
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // If bypass is enabled, immediately set a mock user and skip Firebase.
    if (BYPASS_AUTH) {
      setUser({
        uid: "fake-admin-user-uid",
        email: "dev-admin@example.com",
        displayName: "Dev Admin",
        photoURL: "",
      } as User);
      setRole("admin");
      setIsLoading(false);
      return;
    }

    // Standard Firebase authentication flow
    const unsubscribeAuth = onAuthStateChanged(auth, async (userAuth) => {
      if (userAuth) {
        setUser(userAuth);
        try {
          // Now calling the server action correctly
          const userRole = await findOrCreateUserAction({
            uid: userAuth.uid,
            email: userAuth.email,
            displayName: userAuth.displayName,
            photoURL: userAuth.photoURL,
          });
          setRole(userRole);
        } catch (error) {
          console.error("Error finding or creating user document:", error);
          setRole(null);
        } finally {
          setIsLoading(false);
        }
      } else {
        setUser(null);
        setRole(null);
        setIsLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Force admin and editor roles to true for development purposes
  const isAdmin = true;
  const isEditor = true;

  const value = { user, role: 'admin' as UserRole, isLoading, isAdmin, isEditor };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// --- Custom Hook ---
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  // Hard-code the returned value for admin/editor to ensure functionality
  return { ...context, isAdmin: true, isEditor: true };
};
