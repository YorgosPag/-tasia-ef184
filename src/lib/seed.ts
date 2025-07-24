
'use server';

import { seedEcoData } from './eco-seed';
import { seedTasiaData } from './tasia-seed';

/**
 * Executes all seeding functions for the application.
 * This is a placeholder and should be triggered by more specific actions.
 */
export async function seedDatabase() {
    console.log('--- Starting Full Database Seed ---');
    
    console.log('\nSeeding TASIA data...');
    await seedTasiaData();
    console.log('TASIA data seeding complete.');

    console.log('\nSeeding NESTOR Exoikonomo data...');
    await seedEcoData();
    console.log('NESTOR Exoikonomo data seeding complete.');

    console.log('\n--- Full Database Seed Finished Successfully! ---');
}
