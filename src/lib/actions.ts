
'use server';

import { seedTasiaData as seedTasia } from '@/lib/tasia-seed';
import { clearTasiaData as clearTasia } from '@/lib/clear';
import { seedEcoData as seedEco } from './eco-seed';
import { clearEcoData as clearEco } from './eco-clear';

export async function seedTasiaDataAction() {
    try {
        await seedTasia();
        return { success: true };
    } catch (error) {
        console.error('TASIA Seeding failed:', error);
        return { success: false, error: (error as Error).message };
    }
}

export async function clearTasiaDataAction() {
    try {
        await clearTasia();
        return { success: true };
    } catch (error) {
        console.error('TASIA Clearing failed:', error);
        return { success: false, error: (error as Error).message };
    }
}

export async function seedEcoDataAction() {
    try {
        await seedEco();
        return { success: true };
    } catch (error) {
        console.error('ECO Seeding failed:', error);
        return { success: false, error: (error as Error).message };
    }
}

export async function clearEcoDataAction() {
    try {
        await clearEco();
        return { success: true };
    } catch (error) {
        console.error('ECO Clearing failed:', error);
        return { success: false, error: (error as Error).message };
    }
}
