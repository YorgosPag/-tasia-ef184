
'use server';

import { seedTasiaData } from '@/lib/tasia-seed';
import { clearTasiaData } from '@/lib/clear';
import { seedEcoData } from './eco-seed';
import { clearEcoData } from './eco-clear';


export async function seedTasiaDataAction() {
    try {
        await seedTasiaData();
        return { success: true };
    } catch (error) {
        console.error('TASIA Seeding failed:', error);
        return { success: false, error: (error as Error).message };
    }
}

export async function clearTasiaDataAction() {
    try {
        await clearTasiaData();
        return { success: true };
    } catch (error) {
        console.error('TASIA Clearing failed:', error);
        return { success: false, error: (error as Error).message };
    }
}

export async function seedEcoDataAction() {
    try {
        await seedEcoData();
        return { success: true };
    } catch (error) {
        console.error('ECO Seeding failed:', error);
        return { success: false, error: (error as Error).message };
    }
}

export async function clearEcoDataAction() {
    try {
        await clearEcoData();
        return { success: true };
    } catch (error) {
        console.error('ECO Clearing failed:', error);
        return { success: false, error: (error as Error).message };
    }
}
