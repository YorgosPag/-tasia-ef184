
'use server';

import {
  collection,
  writeBatch,
  getDocs,
  query,
} from 'firebase/firestore';
import { db } from './firebase';

const BATCH_LIMIT = 499; // Firestore batch limit is 500

/**
 * Deletes all documents from a specified collection in batches.
 * @param collectionName The name of the collection to clear.
 */
async function clearCollection(collectionName: string) {
    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef);
    
    let snapshot = await getDocs(q);
    while (snapshot.size > 0) {
        console.log(`Found ${snapshot.size} documents in "${collectionName}". Preparing to delete...`);
        let batch = writeBatch(db);
        let count = 0;
        
        for (const doc of snapshot.docs) {
            batch.delete(doc.ref);
            count++;
            if (count >= BATCH_LIMIT) {
                await batch.commit();
                console.log(`Committed a batch of ${count} deletions from "${collectionName}".`);
                batch = writeBatch(db);
                count = 0;
            }
        }

        if (count > 0) {
            await batch.commit();
            console.log(`Committed final batch of ${count} deletions from "${collectionName}".`);
        }
        
        // Check if there are more documents to delete in a subsequent pass
        snapshot = await getDocs(q);
    }

    console.log(`Successfully cleared collection "${collectionName}".`);
}


/**
 * Clears all managed collections from the database by deleting all documents within them.
 * It also clears nested subcollections where applicable.
 */
export async function clearDatabase() {
    console.log('Starting database cleanup...');
    
    // Clear subcollections first to avoid orphaned data issues if needed,
    // although our current structure with top-level collections is robust.
    const projectsSnapshot = await getDocs(collection(db, 'projects'));
    for (const projectDoc of projectsSnapshot.docs) {
        const buildingsSnapshot = await getDocs(collection(projectDoc.ref, 'buildings'));
        for (const buildingDoc of buildingsSnapshot.docs) {
            const floorsSnapshot = await getDocs(collection(buildingDoc.ref, 'floors'));
            for (const floorDoc of floorsSnapshot.docs) {
                await clearCollection(`projects/${projectDoc.id}/buildings/${buildingDoc.id}/floors/${floorDoc.id}/units`);
            }
            await clearCollection(`projects/${projectDoc.id}/buildings/${buildingDoc.id}/floors`);
        }
        await clearCollection(`projects/${projectDoc.id}/buildings`);

        const workStagesSnapshot = await getDocs(collection(projectDoc.ref, 'workStages'));
        for(const workStageDoc of workStagesSnapshot.docs) {
            await clearCollection(`projects/${projectDoc.id}/workStages/${workStageDoc.id}/workSubstages`);
        }
        await clearCollection(`projects/${projectDoc.id}/workStages`);
    }

    // Clear all top-level collections
    const collectionsToClear = ['contacts', 'attachments', 'units', 'floors', 'buildings', 'projects', 'companies', 'auditLogs', 'users', 'workStages', 'workSubstages', 'leads'];
    for (const collectionName of collectionsToClear) {
        await clearCollection(collectionName);
    }
    
    console.log('Database cleanup finished successfully!');
}
