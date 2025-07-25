
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
    // This function will bypass login by creating a mock admin user.
    // To re-enable actual authentication, remove or comment out this useEffect.
    const mockUser = {
        uid: 'mock-admin-user',
        email: 'admin@tasia.dev',
        displayName: 'Admin User',
        // Add any other user properties your app might need
    } as User;
    
    setUser(mockUser);
    setRole('admin');
    setIsLoading(false);

  }, []);


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
