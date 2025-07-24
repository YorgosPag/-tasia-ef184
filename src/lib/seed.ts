
'use server';

import { seedTasiaData } from './tasia-seed';
import { seedEcoData } from './eco-seed';

/**
 * Executes all seeding functions for the entire application.
 */
export async function seedDatabase() {
    console.log('--- Starting Full Database Seed ---');
    
    console.log('\n[1/2] Seeding TASIA Real Estate data...');
    await seedTasiaData();
    console.log('[1/2] TASIA data seeding complete.');
    
    console.log('\n[2/2] Seeding NESTOR Exoikonomo data...');
    await seedEcoData();
    console.log('[2/2] NESTOR Exoikonomo data seeding complete.');

    console.log('\n--- Full Database Seed Finished Successfully! ---');
}
