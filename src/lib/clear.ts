
'use server';

import {
  collection,
  writeBatch,
  getDocs,
} from 'firebase/firestore';
import { db } from './firebase';

const BATCH_LIMIT = 499; // Firestore batch limit is 500

/**
 * Deletes all documents from a specified collection in batches.
 * @param collectionName The name of the collection to clear.
 */
async function clearCollection(collectionName: string) {
    const collectionRef = collection(db, collectionName);
    const snapshot = await getDocs(collectionRef);
    if (snapshot.empty) {
        console.log(`Collection "${collectionName}" is already empty.`);
        return;
    }

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

    console.log(`Successfully cleared collection "${collectionName}".`);
}

/**
 * Clears all managed collections from the database.
 */
export async function clearDatabase() {
    console.log('Starting database cleanup...');
    const collectionsToClear = ['attachments', 'units', 'floors', 'buildings', 'projects', 'companies', 'auditLogs'];
    for (const collectionName of collectionsToClear) {
        await clearCollection(collectionName);
    }
    console.log('Database cleanup finished successfully!');
}
