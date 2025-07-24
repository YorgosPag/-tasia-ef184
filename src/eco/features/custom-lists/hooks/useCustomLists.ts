
'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  getDocs,
  writeBatch,
  where,
  limit,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

export interface ListItem {
  id: string;
  value: string;
  code?: string;
}

export interface CustomList {
  id: string;
  title: string;
  description: string;
  hasCode: boolean;
  isProtected?: boolean;
  items: ListItem[];
}

export function useCustomLists() {
  const [lists, setLists] = useState<CustomList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const q = query(collection(db, 'tsia-custom-lists'), orderBy('title'));
    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const listsData = await Promise.all(
        querySnapshot.docs.map(async (listDoc) => {
          const itemsQuery = query(collection(listDoc.ref, 'tsia-items'), orderBy('value', 'asc'));
          const itemsSnapshot = await getDocs(itemsQuery);
          const items = itemsSnapshot.docs.map(itemDoc => ({ id: itemDoc.id, ...itemDoc.data() } as ListItem));
          return { id: listDoc.id, ...listDoc.data(), items } as CustomList;
        })
      );
      setLists(listsData);
      setIsLoading(false);
    }, (error) => {
        console.error("Error fetching custom lists:", error);
        toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Δεν ήταν δυνατή η φόρτωση των λιστών.'});
        setIsLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);

  const addList = useCallback(async (listData: Omit<CustomList, 'id' | 'items'>) => {
    try {
      await addDoc(collection(db, 'tsia-custom-lists'), {
        ...listData,
        createdAt: serverTimestamp(),
      });
      toast({ title: 'Επιτυχία', description: 'Η λίστα δημιουργήθηκε.' });
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Η δημιουργία της λίστας απέτυχε.' });
    }
  }, [toast]);

  const updateList = useCallback(async (id: string, title: string, description: string) => {
    try {
      await updateDoc(doc(db, 'tsia-custom-lists', id), { title, description });
      toast({ title: 'Επιτυχία', description: 'Η λίστα ενημερώθηκε.' });
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Η ενημέρωση της λίστας απέτυχε.' });
    }
  }, [toast]);

  const deleteList = useCallback(async (id: string) => {
    try {
      await deleteDoc(doc(db, 'tsia-custom-lists', id));
      toast({ title: 'Επιτυχία', description: 'Η λίστα διαγράφηκε.' });
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Η διαγραφή της λίστας απέτυχε.' });
    }
  }, [toast]);

  const addItem = useCallback(async (listId: string, rawValue: string) => {
    const list = lists.find(l => l.id === listId);
    if (!list) return;

    const itemsToAdd: { value: string; code?: string }[] = [];
    const existingValues = new Set(list.items.map(i => i.value.toLowerCase()));
    const existingCodes = new Set(list.items.map(i => i.code).filter(Boolean));

    if (list.hasCode) {
        const lines = rawValue.split(/[\r\n]+/).map(l => l.trim()).filter(Boolean);
        lines.forEach(line => {
            const firstSpaceIndex = line.indexOf(' ');
            if (firstSpaceIndex === -1) return;

            const code = line.substring(0, firstSpaceIndex).trim();
            const value = line.substring(firstSpaceIndex + 1).trim();

            if (code && value && !existingCodes.has(code)) {
                itemsToAdd.push({ code, value });
                existingCodes.add(code);
            }
        });
    } else {
        const values = rawValue.split(/[;\n\t]+/).map(v => v.trim()).filter(Boolean);
        values.forEach(value => {
            if (!existingValues.has(value.toLowerCase())) {
                itemsToAdd.push({ value });
                existingValues.add(value.toLowerCase());
            }
        });
    }

    if (itemsToAdd.length === 0) {
        toast({ variant: 'destructive', title: 'Δεν προστέθηκαν στοιχεία', description: 'Τα στοιχεία που εισάγατε υπάρχουν ήδη.' });
        return;
    }

    try {
        const batch = writeBatch(db);
        const listRef = collection(db, 'tsia-custom-lists', listId, 'tsia-items');
        itemsToAdd.forEach(item => {
            batch.set(doc(listRef), { ...item, createdAt: serverTimestamp() });
        });
        await batch.commit();
        toast({ title: 'Επιτυχία', description: `${itemsToAdd.length} στοιχεία προστέθηκαν.` });
    } catch (error) {
        console.error(error);
        toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Η προσθήκη των στοιχείων απέτυχε.' });
    }
  }, [lists, toast]);

  const updateItem = useCallback(async (listId: string, itemId: string, data: Partial<ListItem>) => {
    try {
      const cleanData = { ...data };
      delete (cleanData as any).id;
      await updateDoc(doc(db, 'tsia-custom-lists', listId, 'tsia-items', itemId), cleanData);
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Η ενημέρωση απέτυχε.' });
    }
  }, [toast]);

  const deleteItem = useCallback(async (listId: string, itemId: string, itemValue: string) => {
    try {
      await deleteDoc(doc(db, 'tsia-custom-lists', listId, 'tsia-items', itemId));
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Η διαγραφή απέτυχε.' });
    }
  }, [toast]);

  return { lists, isLoading, addList, updateList, deleteList, addItem, updateItem, deleteItem };
}
