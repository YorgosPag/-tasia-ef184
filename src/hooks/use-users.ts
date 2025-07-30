

'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/use-auth';
import { logActivity } from '@/lib/logger';
import { useQuery, useQueryClient } from '@tanstack/react-query';

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
        // We let react-query manage caching, so we don't unsubscribe here.
        resolve(usersData);
      },
      (error) => {
        console.error("Failed to fetch users:", error);
        reject(error);
      }
    );
    
    // Note: In a real-world app, you might want to return the unsubscribe function
    // and manage it, but for useQuery's managed lifecycle, this is okay.
  });
}

export function useUsers() {
  const { user, isAdmin } = useAuth();
  const queryClient = useQueryClient();
  
  const { data: users = [], isLoading } = useQuery({
      queryKey: ['users'],
      queryFn: () => fetchUsers(isAdmin),
      enabled: isAdmin, // Only run the query if the user is an admin
  });
  
  const updateUserRole = async (userId: string, newRole: 'admin' | 'editor' | 'viewer'): Promise<boolean> => {
    if (!isAdmin) {
      console.error("Permission denied: Only admins can change roles.");
      return false;
    }

    // Prevent an admin from demoting themselves if they are the last admin
    if (user?.uid === userId) {
        const adminUsers = users.filter(u => u.role === 'admin');
        if(adminUsers.length === 1 && adminUsers[0].id === userId && newRole !== 'admin') {
            console.error("Cannot demote the last admin.");
            return false;
        }
    }

    try {
      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, { role: newRole });
      
      await logActivity('UPDATE_USER_ROLE', {
        entityId: userId,
        entityType: 'user',
        details: `Set role to ${newRole}`,
      });

      // Manually invalidate the query to force a refetch
      queryClient.invalidateQueries({ queryKey: ['users'] });
      
      return true;
    } catch (error) {
      console.error("Error updating user role:", error);
      return false;
    }
  };

  return { users, isLoading, updateUserRole };
}
