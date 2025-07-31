"use server";

import {
  collection,
  writeBatch,
  doc,
  serverTimestamp,
  deleteDoc,
  updateDoc,
  getDocs,
  where,
  limit,
  setDoc,
  addDoc,
  query,
  orderBy,
  getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

// --- Interfaces ---
export interface ListItem {
  id: string;
  value: string;
  code?: string;
  createdAt: any;
}

export interface CustomList {
  id: string; // The Firestore document ID, now used as the unique, immutable key
  title: string;
  description?: string;
  hasCode?: boolean;
  isProtected?: boolean;
  createdAt: any;
  items: ListItem[];
}

export type CreateListData = Omit<CustomList, "id" | "createdAt" | "items">;

// This file maps specific custom list IDs to their corresponding field in the 'contacts' collection.
// It's used to check for dependencies before deleting a list item, ensuring data integrity.
export const listIdToContactFieldMap: { [key: string]: string } = {
  // Map 'Ρόλοι' list to 'job.role' field in contacts
  Jz1pB5tZSC8d41w8uKlA: "job.role",
  // Map 'Ειδικότητες' list to 'job.specialty' field in contacts
  k8zyKz2mC0d7j4x3R5bH: "job.specialty",
  // Map 'Εκδ. Αρχή' list to 'identity.issuingAuthority' field in contacts
  iGOjn86fcktREwMeDFPz: "identity.issuingAuthority",
  // Map 'Τύπος Ταυτότητας' list to 'identity.type' field in contacts
  jIt8lRiNcgatSchI90yd: "identity.type",
  // Map 'ΔΟΥ' list to 'doy' field in contacts
  pL5fV6w8X9y7zE1bN3cO: "doy",
};

// --- Firestore Operations ---

export async function createCustomList(
  listData: CreateListData,
): Promise<string> {
  const listRef = doc(collection(db, "tsia-custom-lists"));
  await setDoc(listRef, { ...listData, createdAt: serverTimestamp() });
  return listRef.id;
}

export async function updateCustomList(
  listId: string,
  data: Partial<CreateListData>,
): Promise<void> {
  await updateDoc(doc(db, "tsia-custom-lists", listId), data);
}

export async function deleteCustomList(listId: string): Promise<void> {
  const batch = writeBatch(db);
  const listRef = doc(db, "tsia-custom-lists", listId);
  const itemsQuery = query(collection(listRef, "tsia-items"));
  const itemsSnapshot = await getDocs(itemsQuery);
  itemsSnapshot.docs.forEach((itemDoc) => batch.delete(itemDoc.ref));
  batch.delete(listRef);
  await batch.commit();
}

export async function addItemsToCustomList(
  listId: string,
  rawValue: string,
  hasCode?: boolean,
): Promise<void> {
  // Guard clause to ensure listId is valid
  if (!listId || typeof listId !== "string" || !listId.trim()) {
    throw new Error("Invalid or empty listId provided.");
  }

  const listRef = doc(db, "tsia-custom-lists", listId);
  const listDoc = await getDoc(listRef);
  if (!listDoc.exists()) throw new Error("List not found.");

  const itemsCollectionRef = collection(listRef, "tsia-items");
  const existingItemsSnapshot = await getDocs(itemsCollectionRef);
  const existingItems = existingItemsSnapshot.docs.map((d) => d.data());

  let itemsToAdd: { value: string; code?: string }[] = [];

  if (hasCode) {
    const lines = rawValue
      .split(/[\r\n]+/)
      .map((l) => l.trim())
      .filter(Boolean);
    itemsToAdd = lines
      .map((line) => {
        const firstSpaceIndex = line.indexOf(" ");
        if (firstSpaceIndex === -1) return { code: line, value: line };
        return {
          code: line.substring(0, firstSpaceIndex).trim(),
          value: line.substring(firstSpaceIndex + 1).trim(),
        };
      })
      .filter(
        (item) =>
          item.code &&
          !existingItems.some(
            (ex) => ex.code?.toLowerCase() === item.code?.toLowerCase(),
          ),
      );
  } else {
    const values = rawValue
      .split(/[;\n\r\t]+/)
      .map((v) => v.trim())
      .filter(Boolean);
    itemsToAdd = values
      .filter(
        (value) =>
          !existingItems.some(
            (ex) => ex.value.toLowerCase() === value.toLowerCase(),
          ),
      )
      .map((value) => ({ value }));
  }

  if (itemsToAdd.length === 0) {
    throw new Error("Όλα τα στοιχεία που εισάγατε υπάρχουν ήδη.");
  }

  const batch = writeBatch(db);
  itemsToAdd.forEach((item) => {
    const newItemRef = doc(itemsCollectionRef);
    batch.set(newItemRef, { ...item, createdAt: serverTimestamp() });
  });
  await batch.commit();
}

export async function updateCustomListItem(
  listId: string,
  itemId: string,
  data: { value: string; code?: string },
): Promise<void> {
  await updateDoc(
    doc(db, "tsia-custom-lists", listId, "tsia-items", itemId),
    data,
  );
}

export async function deleteCustomListItem(
  listId: string,
  itemId: string,
): Promise<void> {
  await deleteDoc(doc(db, "tsia-custom-lists", listId, "tsia-items", itemId));
}

export async function checkListItemDependencies(
  contactField: string,
  itemValue: string,
): Promise<string | null> {
  if (!contactField) return null;

  const q = query(
    collection(db, "contacts"),
    where(contactField, "==", itemValue),
    limit(1),
  );
  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    return snapshot.docs[0].data().name as string;
  }
  return null;
}

export async function checkListDependencies(
  contactField: string,
  itemValues: string[],
): Promise<{ value: string; contactName: string }[]> {
  if (!contactField || itemValues.length === 0) return [];

  // Firestore 'in' queries are limited to 30 values at a time.
  const CHUNK_SIZE = 30;
  const dependencies: { value: string; contactName: string }[] = [];

  for (let i = 0; i < itemValues.length; i += CHUNK_SIZE) {
    const chunk = itemValues.slice(i, i + CHUNK_SIZE);
    if (chunk.length === 0) continue;

    const q = query(
      collection(db, "contacts"),
      where(contactField, "in", chunk),
    );
    const snapshot = await getDocs(q);

    snapshot.forEach((doc) => {
      dependencies.push({
        value: doc.data()[contactField],
        contactName: doc.data().name,
      });
    });

    // Stop checking if we already have enough examples
    if (dependencies.length >= 2) {
      return dependencies;
    }
  }

  return dependencies;
}
