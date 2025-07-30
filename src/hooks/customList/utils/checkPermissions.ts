
'use client';

import type { User } from 'firebase/auth';

/**
 * A utility function to check if a user has admin privileges.
 * In this implementation, it's a simple check, but could be expanded.
 * @param user The user object from Firebase Auth.
 * @returns True if the user is considered an admin, false otherwise.
 */
export function hasAdminPermission(user: User | null | undefined): boolean {
  // For now, we'll assume any logged-in user can perform actions.
  // In a real application, you would check a 'role' field on the user object.
  return !!user;
}
