
'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

type UserRole = 'admin' | 'editor' | 'viewer';

interface AuthContextType {
  user: User | null | undefined; // undefined: initial loading, null: not logged in
  role: UserRole | null;
  isLoading: boolean;
  isAdmin: boolean;
  isEditor: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: undefined,
  role: null,
  isLoading: true,
  isAdmin: false,
  isEditor: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        // User is logged out
        setRole(null);
        setIsLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (user === undefined) return; // Still waiting for auth state
    if (user === null) return; // User is logged out, handled by auth listener

    // User is logged in, now listen for role changes
    const userDocRef = doc(db, 'users', user.uid);
    const unsubscribeRole = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setRole(docSnap.data().role as UserRole);
      } else {
        // This case might happen for a brief moment for new users
        // or if the doc doesn't exist. Default to 'viewer'.
        setRole('viewer');
      }
      setIsLoading(false); // Stop loading once we have the role
    }, (error) => {
        console.error("Error fetching user role:", error);
        setRole('viewer'); // Fallback role on error
        setIsLoading(false);
    });

    return () => unsubscribeRole();
  }, [user]);

  const isAdmin = role === 'admin';
  const isEditor = role === 'admin' || role === 'editor';

  return (
    <AuthContext.Provider value={{ user, role, isLoading, isAdmin, isEditor }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
