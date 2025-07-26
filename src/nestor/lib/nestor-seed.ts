'use server';

import {
  collection,
  writeBatch,
  serverTimestamp,
  doc,
} from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';
import { customListsData, policeStationsData } from './nestor-data';
import { contactsData } from './nestor-contacts-data';

/**
 * Seeds the Firestore database with the initial custom lists and complex entities for the "Exoikonomo" app.
 */
export async function seedNestorData() {
  const batch = writeBatch(db);
  console.log('Starting NESTOR Exoikonomo seed...');

  // --- Seed Custom Lists ---
  console.log('Seeding custom lists...');
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
  console.log(`${customListsData.length} custom lists queued.`);

  // --- Seed Complex Entities (Police Stations) ---
  console.log('Seeding police stations...');
  const policeStationsRef = collection(db, 'tsia-complex-entities');
  for (const station of policeStationsData) {
      const stationRef = doc(policeStationsRef);
      batch.set(stationRef, { ...station, createdAt: serverTimestamp() });
  }
  console.log(`${policeStationsData.length} police stations queued.`);
  
  // --- Seed Contacts ---
  console.log('Seeding contacts...');
  const contactsRef = collection(db, 'tsia-contacts');
  for (const contact of contactsData) {
      const contactRef = doc(contactsRef);
      batch.set(contactRef, { ...contact, createdAt: serverTimestamp() });
  }
  console.log(`${contactsData.length} contacts queued.`);


  try {
    await batch.commit();
    console.log(`NESTOR Exoikonomo data has been successfully seeded.`);
  } catch (error) {
    console.error("Error seeding NESTOR Exoikonomo data:", error);
    throw error;
  }
}
