
'use server';

import {
  collection,
  writeBatch,
  serverTimestamp,
  doc,
} from 'firebase/firestore';
import { db } from './firebase';
import { customListsData } from './eco-data';

/**
 * Seeds the Firestore database with the initial custom lists for the "Exoikonomo" app.
 */
export async function seedEcoData() {
  const batch = writeBatch(db);
  console.log('Starting NESTOR Exoikonomo custom lists seed...');

  for (const list of customListsData) {
    const { items, ...listData } = list;
    const listRef = doc(collection(db, 'tsia-custom-lists'));

    batch.set(listRef, {
      ...listData,
      isProtected: true, // Mark seeded lists as protected
      createdAt: serverTimestamp(),
    });

    if (items && items.length > 0) {
      const itemsRef = collection(listRef, 'tsia-items');
      for (const item of items) {
        const itemRef = doc(itemsRef);
        batch.set(itemRef, { ...item, createdAt: serverTimestamp() });
      }
    }
  }

  try {
    await batch.commit();
    console.log(`${customListsData.length} custom lists have been successfully seeded for NESTOR Exoikonomo.`);
  } catch (error) {
    console.error("Error seeding custom lists:", error);
    throw new Error("Failed to seed NESTOR Exoikonomo custom lists.");
  }
}
