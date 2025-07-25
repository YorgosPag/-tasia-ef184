
'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './use-auth';
import { logActivity } from '@/lib/logger';

export interface UserWithRole {
  id: string;
  displayName?: string;
  email?: string;
  photoURL?: string;
  role: 'admin' | 'editor' | 'viewer';
}

export function useUsers() {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAdmin } = useAuth();

  useEffect(() => {
    // Temporarily disabled to resolve auth issues.
    // This hook will return an empty array until the root cause is fixed.
    setUsers([]);
    setIsLoading(false);
    return;
    
    // Original logic is commented out below
    /*
    if (!isAdmin) {
      setUsers([]);
      setIsLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(collection(db, 'users'), 
      (snapshot) => {
        const usersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        } as UserWithRole));
        setUsers(usersData);
        setIsLoading(false);
      },
      (error) => {
        console.error("Failed to fetch users:", error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
    */
  }, [isAdmin]);

  const updateUserRole = async (userId: string, newRole: 'admin' | 'editor' | 'viewer') => {
    if (!isAdmin) {
      console.error("Permission denied: Only admins can change roles.");
      return false;
    }
    try {
      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, { role: newRole });
      
      // Log this action
      await logActivity('UPDATE_USER_ROLE', {
        entityId: userId,
        entityType: 'user',
        details: `Set role to ${newRole}`,
      });

      return true;
    } catch (error) {
      console.error("Error updating user role:", error);
      return false;
    }
  };

  return { users, isLoading, updateUserRole };
}
