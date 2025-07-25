'use server';

import { seedTasiaData as seedTasia } from '@/lib/tasia-seed';
import { clearTasiaData as clearTasia } from '@/lib/clear';
import { seedEcoData as seedEco } from './eco-seed';
import { clearEcoData as clearEco } from './eco-clear';
import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
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

// ✅ Αφαίρεση ελέγχου isAdmin — μόνο login απαιτείται
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

export async function seedEcoDataAction(userId: string) {
    if (!(await isAdmin(userId))) {
        return { success: false, error: 'Unauthorized: Only admins can seed data.' };
    }
    try {
        await seedEco();
        await logActivity('SEED_DATA', { entityType: 'database', details: { app: 'ECO' }, userId });
        return { success: true };
    } catch (error) {
        console.error('ECO Seeding failed:', error);
        return { success: false, error: (error as Error).message };
    }
}

export async function clearEcoDataAction(userId: string) {
    if (!(await isAdmin(userId))) {
        return { success: false, error: 'Unauthorized: Only admins can clear data.' };
    }
    try {
        await clearEco();
        await logActivity('CLEAR_DATA', { entityType: 'database', details: { app: 'ECO' }, userId });
        return { success: true };
    } catch (error) {
        console.error('ECO Clearing failed:', error);
        return { success: false, error: (error as Error).message };
    }
}
