
'use server';

import { seedTasiaData as seedTasia } from '@/lib/tasia-seed';
import { clearTasiaData as clearTasia } from '@/lib/clear';
import { seedEcoData as seedEco } from './eco-seed';
import { clearEcoData as clearEco } from './eco-clear';
import { auth, db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';


async function isAdmin(): Promise<boolean> {
    const user = auth.currentUser;
    if (!user) return false;

    const userDocRef = doc(db, 'users', user.uid);
    try {
        const userDoc = await getDoc(userDocRef);
        return userDoc.exists() && userDoc.data().role === 'admin';
    } catch (error) {
        console.error("Error checking admin status:", error);
        return false;
    }
}


export async function seedTasiaDataAction() {
    const adminUser = await isAdmin();
    if (!adminUser) {
        return { success: false, error: 'Unauthorized: Only admins can seed data.' };
    }
    try {
        await seedTasia();
        return { success: true };
    } catch (error) {
        console.error('TASIA Seeding failed:', error);
        return { success: false, error: (error as Error).message };
    }
}

export async function clearTasiaDataAction() {
    const adminUser = await isAdmin();
    if (!adminUser) {
        return { success: false, error: 'Unauthorized: Only admins can clear data.' };
    }
    try {
        await clearTasia();
        return { success: true };
    } catch (error) {
        console.error('TASIA Clearing failed:', error);
        return { success: false, error: (error as Error).message };
    }
}

export async function seedEcoDataAction() {
    const adminUser = await isAdmin();
    if (!adminUser) {
        return { success: false, error: 'Unauthorized: Only admins can seed data.' };
    }
    try {
        await seedEco();
        return { success: true };
    } catch (error) {
        console.error('ECO Seeding failed:', error);
        return { success: false, error: (error as Error).message };
    }
}

export async function clearEcoDataAction() {
    const adminUser = await isAdmin();
    if (!adminUser) {
        return { success: false, error: 'Unauthorized: Only admins can clear data.' };
    }
    try {
        await clearEco();
        return { success: true };
    } catch (error) {
        console.error('ECO Clearing failed:', error);
        return { success: false, error: (error as Error).message };
    }
}
