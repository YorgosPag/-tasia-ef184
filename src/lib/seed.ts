
'use server';

import { seedEcoData } from './eco-seed';

/**
 * Executes all seeding functions for the application.
 */
export async function seedDatabase() {
    console.log('--- Starting Full Database Seed ---');
    
    console.log('\nSeeding NESTOR Exoikonomo data...');
    await seedEcoData();
    console.log('NESTOR Exoikonomo data seeding complete.');

    console.log('\n--- Full Database Seed Finished Successfully! ---');
}
