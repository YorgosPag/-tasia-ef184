
'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './use-auth';
import { logActivity } from '@/lib/logger';
import { useQuery } from '@tanstack/react-query';

export interface UserWithRole {
  id: string;
  displayName?: string;
  email?: string;
  photoURL?: string;
  role: 'admin' | 'editor' | 'viewer';
}

function fetchUsers(isAdmin: boolean): Promise<UserWithRole[]> {
  return new Promise((resolve, reject) => {
    if (!isAdmin) {
      resolve([]);
      return;
    }

    const q = collection(db, 'users');
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const usersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        } as UserWithRole));
        // Unsubscribe after the first successful fetch to behave like a one-time get
        unsubscribe();
        resolve(usersData);
      },
      (error) => {
        console.error("Failed to fetch users:", error);
        unsubscribe();
        reject(error);
      }
    );
  });
}

export function useUsers() {
  const { isAdmin } = useAuth();
  
  const { data: users = [], isLoading } = useQuery({
      queryKey: ['users', isAdmin],
      queryFn: () => fetchUsers(isAdmin),
      enabled: isAdmin,
      refetchOnWindowFocus: false, // Prevents refetching on window focus
  });
  
  const updateUserRole = async (userId: string, newRole: 'admin' | 'editor' | 'viewer') => {
    if (!isAdmin) {
      console.error("Permission denied: Only admins can change roles.");
      return false;
    }
    try {
      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, { role: newRole });
      
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
