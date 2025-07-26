'use server';

import {
  collection,
  writeBatch,
  getDocs,
  query,
} from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';

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
        let batch = writeBatch(db);
        let count = 0;
        
        for (const doc of snapshot.docs) {
            batch.delete(doc.ref);
            count++;
            if (count >= BATCH_LIMIT) {
                await batch.commit();
                batch = writeBatch(db);
                count = 0;
            }
        }

        if (count > 0) {
            await batch.commit();
        }
        
        snapshot = await getDocs(q);
    }

    console.log(`Successfully cleared collection "${collectionName}".`);
}

/**
 * Clears all NESTOR Exoikonomo-related collections from the database.
 */
export async function clearNestorData() {
    console.log('Starting NESTOR Exoikonomo database cleanup...');

    // Clear main list collections
    const customListsSnapshot = await getDocs(collection(db, 'tsia-custom-lists'));
    for (const listDoc of customListsSnapshot.docs) {
        await clearCollection(`tsia-custom-lists/${listDoc.id}/tsia-items`);
    }
    await clearCollection('tsia-custom-lists');

    // Clear complex entities and contacts
    await clearCollection('tsia-complex-entities');
    await clearCollection('tsia-contacts');

    console.log('NESTOR Exoikonomo database cleanup finished successfully!');
}
