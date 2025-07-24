
'use server';

import { seedDatabase } from '@/lib/seed';
import { clearDatabase } from '@/lib/clear';

export async function seedDatabaseAction() {
    try {
        await seedDatabase();
        return { success: true };
    } catch (error) {
        console.error('Seeding failed:', error);
        return { success: false, error: (error as Error).message };
    }
}

export async function clearDatabaseAction() {
    try {
        await clearDatabase();
        return { success: true };
    } catch (error) {
        console.error('Clearing failed:', error);
        return { success: false, error: (error as Error).message };
    }
}
