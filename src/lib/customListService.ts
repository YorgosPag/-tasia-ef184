
'use server';

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
} from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';

// --- Interfaces ---
export interface ListItem {
  id: string;
  value: string;
  code?: string;
  createdAt: any;
}

export interface CustomList {
  id: string;
  title: string;
  description?: string;
  hasCode?: boolean;
  isProtected?: boolean;
  createdAt: any;
  items: ListItem[];
}

export type CreateListData = Omit<CustomList, 'id' | 'createdAt' | 'items'>;

// --- Mapping for dependency checks ---
const listKeyToContactFieldMap: Record<string, string> = {
  'jIt8lRiNcgatSchI90yd': 'identity.type',
  'iGOjn86fcktREwMeDFPz': 'identity.issuingAuthority',
  // ... other mappings
};

// --- Firestore Operations ---

export async function getAllCustomLists(): Promise<CustomList[]> {
  const listsQuery = query(collection(db, 'tsia-custom-lists'), orderBy('title', 'asc'));
  const listsSnapshot = await getDocs(listsQuery);

  const listsDataPromises = listsSnapshot.docs.map(async (listDoc) => {
    const list = { id: listDoc.id, ...listDoc.data() } as CustomList;
    const itemsQuery = query(collection(listDoc.ref, 'tsia-items'), orderBy('value', 'asc'));
    const itemsSnapshot = await getDocs(itemsQuery);
    list.items = itemsSnapshot.docs.map(itemDoc => ({ id: itemDoc.id, ...itemDoc.data() } as ListItem));
    return list;
  });

  return Promise.all(listsDataPromises);
}

export async function createCustomList(listData: CreateListData): Promise<string> {
  const listRef = doc(collection(db, 'tsia-custom-lists'));
  await setDoc(listRef, { ...listData, createdAt: serverTimestamp() });
  return listRef.id;
}

export async function updateCustomList(listId: string, data: Partial<CreateListData>): Promise<void> {
  await updateDoc(doc(db, 'tsia-custom-lists', listId), data);
}

export async function deleteCustomList(listId: string): Promise<void> {
  const batch = writeBatch(db);
  const listRef = doc(db, 'tsia-custom-lists', listId);
  const itemsQuery = query(collection(listRef, 'tsia-items'));
  const itemsSnapshot = await getDocs(itemsQuery);
  itemsSnapshot.docs.forEach(itemDoc => batch.delete(itemDoc.ref));
  batch.delete(listRef);
  await batch.commit();
}

export async function addItemsToCustomList(listId: string, rawValue: string, hasCode?: boolean): Promise<void> {
  const listRef = doc(db, 'tsia-custom-lists', listId);
  const listDoc = await getDoc(listRef);
  if (!listDoc.exists()) throw new Error("List not found.");

  const itemsCollectionRef = collection(listRef, 'tsia-items');
  const existingItemsSnapshot = await getDocs(itemsCollectionRef);
  const existingItems = existingItemsSnapshot.docs.map(d => d.data());

  let itemsToAdd: { value: string; code?: string }[] = [];

  if (hasCode) {
    const lines = rawValue.split(/[\r\n]+/).map(l => l.trim()).filter(Boolean);
    itemsToAdd = lines.map(line => {
      const firstSpaceIndex = line.indexOf(' ');
      if (firstSpaceIndex === -1) return { code: line, value: line };
      return { code: line.substring(0, firstSpaceIndex).trim(), value: line.substring(firstSpaceIndex + 1).trim() };
    }).filter(item => item.code && !existingItems.some(ex => ex.code?.toLowerCase() === item.code?.toLowerCase()));
  } else {
    const values = rawValue.split(/[;\n\r\t]+/).map(v => v.trim()).filter(Boolean);
    itemsToAdd = values.filter(value => !existingItems.some(ex => ex.value.toLowerCase() === value.toLowerCase())).map(value => ({ value }));
  }

  if (itemsToAdd.length === 0) {
    throw new Error('Όλα τα στοιχεία που εισάγατε υπάρχουν ήδη.');
  }

  const batch = writeBatch(db);
  itemsToAdd.forEach(item => {
    const newItemRef = doc(itemsCollectionRef);
    batch.set(newItemRef, { ...item, createdAt: serverTimestamp() });
  });
  await batch.commit();
}

export async function updateCustomListItem(listId: string, itemId: string, data: { value: string; code?: string }): Promise<void> {
  await updateDoc(doc(db, 'tsia-custom-lists', listId, 'tsia-items', itemId), data);
}

export async function deleteCustomListItem(listId: string, itemId: string): Promise<void> {
  await deleteDoc(doc(db, 'tsia-custom-lists', listId, 'tsia-items', itemId));
}

export async function checkListItemDependencies(listKey: string, itemValue: string): Promise<string | null> {
  const contactField = listKeyToContactFieldMap[listKey];
  if (!contactField) return null;

  const q = query(collection(db, 'contacts'), where(contactField, '==', itemValue), limit(1));
  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    return snapshot.docs[0].data().name as string;
  }
  return null;
}
