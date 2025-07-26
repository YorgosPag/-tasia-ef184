
'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, onSnapshot, setDoc, getDoc, serverTimestamp, collection, getDocs, query, limit } from 'firebase/firestore';
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

async function findOrCreateUserDocument(user: User): Promise<UserRole> {
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
        return userDoc.data().role as UserRole;
    } else {
        // Document does not exist, so create it.
        // Check if this is the very first user to determine role.
        const usersRef = collection(db, 'users');
        const querySnapshot = await getDocs(query(usersRef, limit(1)));
        const isFirstUser = querySnapshot.empty;
        const role: UserRole = isFirstUser ? 'admin' : 'viewer';

        await setDoc(userDocRef, {
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            role: role,
            createdAt: serverTimestamp(),
        });
        console.log(`Created user document for ${user.email} with role: ${role}`);
        return role;
    }
}


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (userAuth) => {
      if (userAuth) {
        setUser(userAuth);
        try {
          const userRole = await findOrCreateUserDocument(userAuth);
          setRole(userRole);
        } catch (error) {
          console.error("Error finding or creating user document:", error);
          setRole(null); // Fallback to no role on error
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
