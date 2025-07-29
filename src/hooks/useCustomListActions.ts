
'use client';

import { useState, useCallback } from 'react';
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
  query
} from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';
import { useToast } from '@/shared/hooks/use-toast';
import { useAuth } from '@/shared/hooks/use-auth';
import { logActivity } from '@/shared/lib/logger';
import { type CustomList, type CreateListData } from './useCustomLists';

interface CreateListResult {
    success: boolean;
    error?: string;
}

const listKeyToContactFieldMap: Record<string, string> = {
    'jIt8lRiNcgatSchI90yd': 'identity.type', // Έγγραφα Ταυτοποίησης
};

export function useCustomListActions(lists: CustomList[], fetchAllLists: () => Promise<void>) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createList = useCallback(async (listData: CreateListData): Promise<CreateListResult> => {
    if (!user) {
        toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Δεν έχετε δικαίωμα για αυτή την ενέργεια.' });
        return { success: false, error: 'Unauthorized' };
    }
    setIsSubmitting(true);
    try {
      const listRef = doc(collection(db, 'tsia-custom-lists'));
      await setDoc(listRef, { ...listData, createdAt: serverTimestamp() });
      toast({ title: 'Επιτυχία', description: 'Η λίστα δημιουργήθηκε.' });
      await logActivity('CREATE_LIST', { entityId: listRef.id, entityType: 'custom-list', name: listData.title });
      await fetchAllLists();
      return { success: true };
    } catch (error) {
        console.error('Error creating list:', error);
        toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Η δημιουργία της λίστας απέτυχε.' });
        return { success: false, error: (error as Error).message };
    } finally {
        setIsSubmitting(false);
    }
  }, [toast, user, fetchAllLists]);

  const updateList = useCallback(async (listId: string, data: Partial<CreateListData>): Promise<boolean> => {
    if(!user) return false;
    try {
      await updateDoc(doc(db, 'tsia-custom-lists', listId), data);
      toast({ title: 'Επιτυχία', description: 'Η λίστα ενημερώθηκε.' });
      await fetchAllLists();
      return true;
    } catch (error) {
      toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Η ενημέρωση απέτυχε.' });
      return false;
    }
  }, [toast, user, fetchAllLists]);

  const deleteList = useCallback(async (listId: string, listTitle: string): Promise<boolean> => {
    if(!user) return false;
    if (!confirm(`Είστε σίγουροι ότι θέλετε να διαγράψετε τη λίστα "${listTitle}" και όλα τα περιεχόμενά της;`)) {
        return false;
    }
    try {
        const batch = writeBatch(db);
        const listRef = doc(db, 'tsia-custom-lists', listId);
        const itemsQuery = query(collection(listRef, 'tsia-items'));
        const itemsSnapshot = await getDocs(itemsQuery);
        itemsSnapshot.docs.forEach(itemDoc => batch.delete(itemDoc.ref));
        batch.delete(listRef);
        await batch.commit();
        toast({ title: 'Επιτυχία', description: 'Η λίστα και όλα τα στοιχεία της διαγράφηκαν.' });
        await logActivity('DELETE_LIST', { entityId: listId, entityType: 'custom-list', name: listTitle });
        await fetchAllLists();
        return true;
    } catch (error) {
        console.error('Error deleting list:', error);
        toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Η διαγραφή απέτυχε.' });
        return false;
    }
  }, [toast, user, fetchAllLists]);

  const addItem = useCallback(async (listId: string, rawValue: string, hasCode?: boolean): Promise<boolean> => {
    if (!user) return false;
    setIsSubmitting(true);
    try {
      const list = lists.find(l => l.id === listId);
      if (!list) throw new Error("List not found.");
      const itemsCollectionRef = collection(db, 'tsia-custom-lists', listId, 'tsia-items');
      const existingItems = list.items;
      let itemsToAdd: { value: string; code?: string }[] = [];
      if (hasCode) {
        const lines = rawValue.split(/[\r\n]+/).map(l => l.trim()).filter(Boolean);
        itemsToAdd = lines.map(line => {
          const firstSpaceIndex = line.indexOf(' ');
          if (firstSpaceIndex === -1) return { code: line, value: line };
          return {
            code: line.substring(0, firstSpaceIndex).trim(),
            value: line.substring(firstSpaceIndex + 1).trim(),
          };
        }).filter(item => item.code && !existingItems.some(ex => ex.code?.toLowerCase() === item.code?.toLowerCase()));
      } else {
        const values = rawValue.split(/[;\n\r\t]+/).map(v => v.trim()).filter(Boolean);
        itemsToAdd = values.filter(value => !existingItems.some(ex => ex.value.toLowerCase() === value.toLowerCase())).map(value => ({ value }));
      }
      if (itemsToAdd.length === 0) {
        toast({ variant: 'default', title: 'Δεν προστέθηκαν νέα στοιχεία', description: 'Όλα τα στοιχεία που εισάγατε υπάρχουν ήδη.' });
        return true;
      }
      const batch = writeBatch(db);
      itemsToAdd.forEach(item => {
        const newItemRef = doc(itemsCollectionRef);
        batch.set(newItemRef, { ...item, createdAt: serverTimestamp() });
      });
      await batch.commit();
      toast({ title: 'Επιτυχία', description: `${itemsToAdd.length} στοιχεία προστέθηκαν.` });
      await fetchAllLists();
      return true;
    } catch (error) {
      console.error('Error adding item(s):', error);
      toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Η προσθήκη απέτυχε.' });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [lists, toast, user, fetchAllLists]);

  const addNewItemToList = useCallback(async (listId: string, value: string, hasCode?: boolean, code?: string): Promise<string | null> => {
    if (!user) return null;
    try {
     const list = lists.find(l => l.id === listId);
     if (!list) throw new Error("List not found.");
     const itemsCollectionRef = collection(db, 'tsia-custom-lists', listId, 'tsia-items');
     if (list.items.some(item => item.value.toLowerCase() === value.toLowerCase())) {
          toast({ variant: 'destructive', title: 'Διπλότυπη Εγγραφή', description: 'Αυτό το στοιχείο υπάρχει ήδη σε αυτή τη λίστα.' });
          return null;
     }
     const newItemData: { value: string, code?: string, createdAt: any } = { value, createdAt: serverTimestamp() };
     if (hasCode) newItemData.code = code || value;
     const docRef = await addDoc(itemsCollectionRef, newItemData);
     toast({ title: 'Επιτυχία', description: 'Το νέο στοιχείο προστέθηκε.' });
     await fetchAllLists();
     return docRef.id;
 } catch (error) {
     console.error('Error adding new item:', error);
     toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Η προσθήκη του νέου στοιχείου απέτυχε.' });
     return null;
 }
}, [lists, toast, user, fetchAllLists]);

  const updateItem = useCallback(async (listId: string, itemId: string, data: { value: string; code?: string }): Promise<boolean> => {
     if(!user) return false;
     try {
         await updateDoc(doc(db, 'tsia-custom-lists', listId, 'tsia-items', itemId), data);
         await fetchAllLists();
         return true;
     } catch (error) {
         toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Η ενημέρωση του στοιχείου απέτυχε.' });
         return false;
     }
  }, [toast, user, fetchAllLists]);

  const deleteItem = useCallback(async (listId: string, listKey: string, itemId: string, itemValue: string): Promise<boolean> => {
    if(!user) return false;
    const contactField = listKeyToContactFieldMap[listKey];
    if (contactField) {
       const q = query(collection(db, 'contacts'), where(contactField, '==', itemValue), limit(1));
       const snapshot = await getDocs(q);
       if (!snapshot.empty) {
           const contactInUse = snapshot.docs[0].data();
           toast({
               variant: 'destructive',
               title: "Αδυναμία Διαγραφής",
               description: `Το στοιχείο "${itemValue}" χρησιμοποιείται από την επαφή: ${contactInUse.name}.`
           });
           return false;
       }
    }
    try {
       await deleteDoc(doc(db, 'tsia-custom-lists', listId, 'tsia-items', itemId));
       toast({ title: 'Επιτυχία', description: `Το στοιχείο "${itemValue}" διαγράφηκε.` });
       await fetchAllLists();
       return true;
    } catch (error) {
       toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Η διαγραφή του στοιχείου απέτυχε.' });
       return false;
    }
 }, [toast, user, fetchAllLists]);

  return {
    isSubmitting,
    createList,
    updateList,
    deleteList,
    addItem,
    addNewItemToList,
    updateItem,
    deleteItem,
  };
}
