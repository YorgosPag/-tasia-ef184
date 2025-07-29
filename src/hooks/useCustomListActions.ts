
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

const listKeyToContactFieldMap: Record<string, string> = {
    'jIt8lRiNcgatSchI90yd': 'identity.type', // Έγγραφα Ταυτοποίησης
};

export function useCustomListActions(lists: CustomList[], fetchAllLists: () => Promise<void>) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const withToastAndRefresh = async <T,>(
    operation: () => Promise<T>,
    {
      loadingMessage = 'Επεξεργασία...',
      successMessage,
      errorMessage,
      onFinally,
    }: {
      loadingMessage?: string;
      successMessage: string;
      errorMessage: string;
      onFinally?: () => void;
    }
  ): Promise<T | null> => {
    if (!user) {
      toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Δεν έχετε δικαίωμα για αυτή την ενέργεια.' });
      return null;
    }
    
    setIsSubmitting(true);
    // Optional: show a loading toast
    // const { id } = toast({ title: loadingMessage });

    try {
      const result = await operation();
      toast({ title: 'Επιτυχία', description: successMessage });
      await fetchAllLists();
      return result;
    } catch (error) {
      console.error(errorMessage, error);
      toast({ variant: 'destructive', title: 'Σφάλμα', description: `${errorMessage}: ${(error as Error).message}` });
      return null;
    } finally {
      setIsSubmitting(false);
      onFinally?.();
    }
  };


  const createList = useCallback(async (listData: CreateListData) => {
    return withToastAndRefresh(
        async () => {
            const listRef = doc(collection(db, 'tsia-custom-lists'));
            await setDoc(listRef, { ...listData, createdAt: serverTimestamp() });
            await logActivity('CREATE_LIST', { entityId: listRef.id, entityType: 'custom-list', name: listData.title });
            return listRef.id;
        },
        { successMessage: 'Η λίστα δημιουργήθηκε.', errorMessage: 'Η δημιουργία της λίστας απέτυχε.' }
    );
  }, [user, fetchAllLists]);

  const updateList = useCallback(async (listId: string, data: Partial<CreateListData>) => {
      return withToastAndRefresh(
          () => updateDoc(doc(db, 'tsia-custom-lists', listId), data),
          { successMessage: 'Η λίστα ενημερώθηκε.', errorMessage: 'Η ενημέρωση απέτυχε.' }
      );
  }, [user, fetchAllLists]);

  const deleteList = useCallback(async (listId: string, listTitle: string) => {
    if (!confirm(`Είστε σίγουροι ότι θέλετε να διαγράψετε τη λίστα "${listTitle}" και όλα τα περιεχόμενά της;`)) {
        return null;
    }
    return withToastAndRefresh(
        async () => {
            const batch = writeBatch(db);
            const listRef = doc(db, 'tsia-custom-lists', listId);
            const itemsQuery = query(collection(listRef, 'tsia-items'));
            const itemsSnapshot = await getDocs(itemsQuery);
            itemsSnapshot.docs.forEach(itemDoc => batch.delete(itemDoc.ref));
            batch.delete(listRef);
            await batch.commit();
            await logActivity('DELETE_LIST', { entityId: listId, entityType: 'custom-list', name: listTitle });
        },
        { successMessage: 'Η λίστα και όλα τα στοιχεία της διαγράφηκαν.', errorMessage: 'Η διαγραφή απέτυχε.'}
    );
  }, [user, fetchAllLists]);

  const addItem = useCallback(async (listId: string, rawValue: string, hasCode?: boolean) => {
    const list = lists.find(l => l.id === listId);
    if (!list) {
        toast({variant: 'destructive', title: 'Σφάλμα', description: 'Δεν βρέθηκε η λίστα.'});
        return null;
    }
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
    
    return withToastAndRefresh(
        async () => {
            const batch = writeBatch(db);
            itemsToAdd.forEach(item => {
                const newItemRef = doc(itemsCollectionRef);
                batch.set(newItemRef, { ...item, createdAt: serverTimestamp() });
            });
            await batch.commit();
        },
        { successMessage: `${itemsToAdd.length} στοιχεία προστέθηκαν.`, errorMessage: 'Η προσθήκη απέτυχε.'}
    );
  }, [lists, user, fetchAllLists, toast]);

  const addNewItemToList = useCallback(async (listId: string, value: string, hasCode?: boolean, code?: string) => {
     const list = lists.find(l => l.id === listId);
     if (!list) {
         toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Δεν βρέθηκε η λίστα.'});
         return null;
     };
     if (list.items.some(item => item.value.toLowerCase() === value.toLowerCase())) {
          toast({ variant: 'destructive', title: 'Διπλότυπη Εγγραφή', description: 'Αυτό το στοιχείο υπάρχει ήδη σε αυτή τη λίστα.' });
          return null;
     }

     return withToastAndRefresh(
         async () => {
            const itemsCollectionRef = collection(db, 'tsia-custom-lists', listId, 'tsia-items');
            const newItemData: { value: string, code?: string, createdAt: any } = { value, createdAt: serverTimestamp() };
            if (hasCode) newItemData.code = code || value;
            const docRef = await addDoc(itemsCollectionRef, newItemData);
            return docRef.id;
         },
         { successMessage: 'Το νέο στοιχείο προστέθηκε.', errorMessage: 'Η προσθήκη του νέου στοιχείου απέτυχε.' }
     );
  }, [lists, user, fetchAllLists, toast]);

  const updateItem = useCallback(async (listId: string, itemId: string, data: { value: string; code?: string }) => {
     return withToastAndRefresh(
         () => updateDoc(doc(db, 'tsia-custom-lists', listId, 'tsia-items', itemId), data),
         { successMessage: 'Το στοιχείο ενημερώθηκε.', errorMessage: 'Η ενημέρωση του στοιχείου απέτυχε.'}
     );
  }, [user, fetchAllLists]);

  const deleteItem = useCallback(async (listId: string, listKey: string, itemId: string, itemValue: string) => {
    if(!user) return null;
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
           return null;
       }
    }
    
    return withToastAndRefresh(
        () => deleteDoc(doc(db, 'tsia-custom-lists', listId, 'tsia-items', itemId)),
        { successMessage: `Το στοιχείο "${itemValue}" διαγράφηκε.`, errorMessage: 'Η διαγραφή του στοιχείου απέτυχε.'}
    );
 }, [user, fetchAllLists, toast]);

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
