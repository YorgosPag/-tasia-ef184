
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
 * @param collectionPath The name of the collection to clear.
 */
async function clearCollection(collectionPath: string) {
    const collectionRef = collection(db, collectionPath);
    const q = query(collectionRef);
    
    let snapshot = await getDocs(q);
    while (snapshot.size > 0) {
        console.log(`Found ${snapshot.size} documents in "${collectionPath}". Preparing to delete...`);
        let batch = writeBatch(db);
        let count = 0;
        
        for (const doc of snapshot.docs) {
            batch.delete(doc.ref);
            count++;
            if (count >= BATCH_LIMIT) {
                await batch.commit();
                console.log(`Committed a batch of ${count} deletions from "${collectionPath}".`);
                batch = writeBatch(db);
                count = 0;
            }
        }

        if (count > 0) {
            await batch.commit();
            console.log(`Committed final batch of ${count} deletions from "${collectionPath}".`);
        }
        
        // Check if there are more documents to delete in a subsequent pass
        snapshot = await getDocs(q);
    }

    console.log(`Successfully cleared collection "${collectionPath}".`);
}


/**
 * Clears all TASIA-related collections from the database.
 */
export async function clearTasiaData() {
    console.log('Starting TASIA database cleanup...');

    const TASIA_COLLECTIONS = [
      'contacts', 'attachments', 'units', 'floors', 
      'buildings', 'projects', 'companies', 'auditLogs', 
      'users', 'workStages', 'workSubstages', 'leads',
      'tsia-list-types', 'tsia-custom-lists'
    ];
    
    // First, clear nested collections which might have deeper nesting
    const projectsSnapshot = await getDocs(collection(db, 'projects'));
    for (const projectDoc of projectsSnapshot.docs) {
        const workStagesSnapshot = await getDocs(collection(projectDoc.ref, 'workStages'));
        for(const workStageDoc of workStagesSnapshot.docs) {
            // Clear any sub-collections of workStages, like workSubstages
            await clearCollection(`projects/${projectDoc.id}/workStages/${workStageDoc.id}/workSubstages`);
        }
        // After clearing sub-collections, clear the workStages collection itself
        await clearCollection(`projects/${projectDoc.id}/workStages`);
        await clearCollection(`projects/${projectDoc.id}/buildings`);
    }

    // Clear all top-level collections for TASIA
    for (const collectionName of TASIA_COLLECTIONS) {
        await clearCollection(collectionName);
    }
    
    console.log('TASIA database cleanup finished successfully!');
}
