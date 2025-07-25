'use server';

import { seedTasiaData as seedTasia } from '@/lib/tasia-seed';
import { clearTasiaData as clearTasia } from '@/lib/clear';
import { seedNestorData as seedNestor } from './nestor-seed';
import { clearNestorData as clearNestor } from './nestor-clear';
import { db } from './firebase';
import { doc, getDoc, collection, query, limit, getDocs } from 'firebase/firestore';
import { logActivity } from './logger';

async function isAdmin(userId: string): Promise<boolean> {
    if (!userId) return false;

    const userDocRef = doc(db, 'users', userId);
    try {
        const userDoc = await getDoc(userDocRef);
        return userDoc.exists() && userDoc.data().role === 'admin';
    } catch (error) {
        console.error("Error checking admin status:", error);
        return false;
    }
}

async function isFirstUser(): Promise<boolean> {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, limit(1));
    const snapshot = await getDocs(q);
    return snapshot.empty;
}


export async function seedTasiaDataAction(userId: string) {
    if (!(await isAdmin(userId))) {
        return { success: false, error: 'Unauthorized: Only admins can seed data.' };
    }
    try {
        await seedTasia();
        await logActivity('SEED_DATA', { entityType: 'database', details: { app: 'TASIA' }, userId });
        return { success: true };
    } catch (error) {
        console.error('TASIA Seeding failed:', error);
        return { success: false, error: (error as Error).message };
    }
}

export async function clearTasiaDataAction(userId: string) {
    if (!userId) {
       return { success: false, error: 'Unauthorized: You must be logged in to clear data.' };
    }
    try {
        await clearTasia();
        await logActivity('CLEAR_DATA', { entityType: 'database', details: { app: 'TASIA' }, userId });
        return { success: true };
    } catch (error) {
        console.error('TASIA Clearing failed:', error);
        return { success: false, error: (error as Error).message };
    }
}

export async function seedNestorDataAction(userId: string) {
    if (!(await isAdmin(userId))) {
        return { success: false, error: 'Unauthorized: Only admins can seed data.' };
    }
    try {
        await seedNestor();
        await logActivity('SEED_DATA', { entityType: 'database', details: { app: 'NESTOR' }, userId });
        return { success: true };
    } catch (error) {
        console.error('NESTOR Seeding failed:', error);
        return { success: false, error: (error as Error).message };
    }
}

export async function clearNestorDataAction(userId: string) {
     if (!userId) {
       return { success: false, error: 'Unauthorized: You must be logged in to clear data.' };
    }
    try {
        await clearNestor();
        await logActivity('CLEAR_DATA', { entityType: 'database', details: { app: 'NESTOR' }, userId });
        return { success: true };
    } catch (error) {
        console.error('NESTOR Clearing failed:', error);
        return { success: false, error: (error as Error).message };
    }
}
