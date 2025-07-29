import { User } from 'firebase/auth';

/**
 * Checks if a user object exists and is authenticated.
 * @param user The user object from Firebase Auth.
 * @returns True if the user is valid, false otherwise.
 */
export function hasAdminPermission(user: User | null | undefined): boolean {
  if (!user) {
    console.warn('Permission denied: User is not authenticated.');
    // In a real app, you might want to show a toast here, but since this is a utility,
    // logging is sufficient. The calling hook handles user feedback.
    return false;
  }
  return true;
}
