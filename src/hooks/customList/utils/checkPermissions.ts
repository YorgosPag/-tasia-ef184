
'use client';

import type { User } from 'firebase/auth';

/**
 * Checks if a user has admin permissions.
 * Currently, this is a placeholder and always returns true for any logged-in user.
 * In a real application, this would check the user's roles/claims.
 * @param user The user object from Firebase Auth.
 * @returns {boolean} True if the user has admin rights, otherwise false.
 */
export function hasAdminPermission(user: User | null | undefined): boolean {
    // In a real app, you would check a custom claim or a 'role' field in the user's Firestore document.
    // For this project, we'll allow any authenticated user to act as an admin for simplicity.
    return !!user;
}
