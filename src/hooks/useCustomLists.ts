
'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  onSnapshot,
  writeBatch,
  doc,
  serverTimestamp,
  query,
  orderBy,
  deleteDoc,
  updateDoc,
  getDocs,
  where,
  limit,
  setDoc,
  addDoc,
} from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';
import { useToast } from '@/shared/hooks/use-toast';
import { useAuth } from '@/shared/hooks/use-auth';
import { logActivity } from '@/shared/lib/logger';

// --- Interfaces ---

export interface ListItem {
  id: string;
  value: string;
  code?: string;
  createdAt: any;
}

export interface CustomList {
  id: string; // The Firestore document ID is now the key
  title: string;
  description?: string;
  hasCode?: boolean;
  isProtected?: boolean;
  createdAt: any;
  items: ListItem[];
}

export type CreateListData = Omit<CustomList, 'id' | 'createdAt' | 'items'>;

interface CreateListResult {
    success: boolean;
    error?: string;
}

const listKeyToContactFieldMap: Record<string, string> = {
    'roles': 'job.role',
    'specialties': 'job.specialty',
    'doy': 'doy',
    'Yz439YFkR4U4eRAwDNy5': 'addresses.type', // address_types
}

// --- Custom Hook ---

export function useCustomLists() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [lists, setLists] = useState<CustomList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const listsQuery = query(collection(db, 'tsia-custom-lists'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(listsQuery, async (snapshot) => {
      try {
        const listsDataPromises = snapshot.docs.map(async (listDoc) => {
            const list = { id: listDoc.id, ...listDoc.data() } as CustomList;
            const itemsQuery = query(collection(listDoc.ref, 'tsia-items'), orderBy('value', 'asc'));
            const itemsSnapshot = await getDocs(itemsQuery);
            list.items = itemsSnapshot.docs.map(itemDoc => ({ id: itemDoc.id, ...itemDoc.data() } as ListItem));
            return list;
        });
        const listsData = await Promise.all(listsDataPromises);
        setLists(listsData);
      } catch (error) {
         console.error("Error processing custom lists snapshot:", error);
         toast({ variant: 'destructive', title: 'Σφάλμα Επεξεργασίας', description: 'Failed to process list data.' });
      } finally {
        setIsLoading(false);
      }
    }, (error) => {
      console.error("Error fetching custom lists:", error);
      toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Failed to load lists.' });
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);
  
  const createList = useCallback(async (listData: CreateListData): Promise<CreateListResult> => {
      // if(!user) return { success: false, error: 'User not authenticated' };
      setIsSubmitting(true);
      try {
        const listRef = doc(collection(db, 'tsia-custom-lists'));
        await setDoc(listRef, { ...listData, createdAt: serverTimestamp() });
        toast({ title: 'Επιτυχία', description: 'Η λίστα δημιουργήθηκε.' });
        await logActivity('CREATE_LIST', { entityId: listRef.id, entityType: 'custom-list', name: listData.title });
        return { success: true };
      } catch (error) {
          console.error('Error creating list:', error);
          toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Η δημιουργία της λίστας απέτυχε.' });
          return { success: false, error: (error as Error).message };
      } finally {
          setIsSubmitting(false);
      }
  }, [toast, user]);

  const updateList = useCallback(async (listId: string, data: Partial<CreateListData>): Promise<boolean> => {
      // if(!user) return false;
      try {
        await updateDoc(doc(db, 'tsia-custom-lists', listId), data);
        toast({ title: 'Επιτυχία', description: 'Η λίστα ενημερώθηκε.' });
        return true;
      } catch (error) {
        toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Η ενημέρωση απέτυχε.' });
        return false;
      }
  }, [toast, user]);

  const deleteList = useCallback(async (listId: string, listTitle: string): Promise<boolean> => {
    // if(!user) return false;
    if (!confirm(`Είστε σίγουροι ότι θέλετε να διαγράψετε τη λίστα "${listTitle}" και όλα τα περιεχόμενά της;`)) {
        return false;
    }
    try {
        const batch = writeBatch(db);
        const listRef = doc(db, 'tsia-custom-lists', listId);
        
        const itemsQuery = query(collection(listRef, 'tsia-items'));
        const itemsSnapshot = await getDocs(itemsQuery);
        
        itemsSnapshot.docs.forEach(itemDoc => {
            batch.delete(itemDoc.ref);
        });

        batch.delete(listRef);

        await batch.commit();
        
        toast({ title: 'Επιτυχία', description: 'Η λίστα και όλα τα στοιχεία της διαγράφηκαν.' });
        await logActivity('DELETE_LIST', { entityId: listId, entityType: 'custom-list', name: listTitle });
        return true;
    } catch (error) {
        console.error('Error deleting list:', error);
        toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Η διαγραφή απέτυχε.' });
        return false;
    }
  }, [toast, user]);

  const addItem = useCallback(async (listId: string, rawValue: string, hasCode?: boolean): Promise<boolean> => {
    // if (!user) return false;
    setIsSubmitting(true);
  
    try {
      const list = lists.find(l => l.id === listId);
      if (!list) throw new Error("List not found.");
  
      const itemsCollectionRef = collection(db, 'tsia-custom-lists', listId, 'tsia-items');
      const existingItems = list.items;
  
      let itemsToAdd: { value: string; code?: string }[] = [];
  
      if (hasCode) {
        const lines = rawValue.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
        itemsToAdd = lines.map(line => {
          const firstSpaceIndex = line.indexOf(' ');
          if (firstSpaceIndex === -1) {
            return { code: line, value: line }; 
          }
          return {
            code: line.substring(0, firstSpaceIndex).trim(),
            value: line.substring(firstSpaceIndex + 1).trim(),
          };
        }).filter(item => {
          return item.code && !existingItems.some(ex => ex.code?.toLowerCase() === item.code?.toLowerCase());
        });
      } else {
        const values = rawValue.split(/[;\n\r\t]+/).map(v => v.trim()).filter(Boolean);
        itemsToAdd = values
          .filter(value => {
            return !existingItems.some(ex => ex.value.toLowerCase() === value.toLowerCase());
          })
          .map(value => ({ value }));
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
      return true;
  
    } catch (error) {
      console.error('Error adding item(s):', error);
      toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Η προσθήκη απέτυχε.' });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [lists, toast, user]);

  const addNewItemToList = useCallback(async (listId: string, value: string, hasCode?: boolean, code?: string): Promise<string | null> => {
      // if (!user) return null;
       try {
        const list = lists.find(l => l.id === listId);
        if (!list) throw new Error("List not found.");

        const itemsCollectionRef = collection(db, 'tsia-custom-lists', listId, 'tsia-items');
        
        // Check for uniqueness before adding
        const q = query(itemsCollectionRef, where('value', '==', value));
        const existing = await getDocs(q);
        if (!existing.empty) {
            toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Αυτό το στοιχείο υπάρχει ήδη.' });
            return null;
        }

        const newItemData: { value: string, code?: string, createdAt: any } = {
            value,
            createdAt: serverTimestamp(),
        };

        if (hasCode) {
            newItemData.code = code || value;
        }

        const docRef = await addDoc(itemsCollectionRef, newItemData);
        toast({ title: 'Επιτυχία', description: 'Το νέο στοιχείο προστέθηκε.' });
        return docRef.id;

    } catch (error) {
        console.error('Error adding new item:', error);
        toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Η προσθήκη του νέου στοιχείου απέτυχε.' });
        return null;
    }
  }, [lists, toast, user]);

  const updateItem = useCallback(async (listId: string, itemId: string, data: { value: string; code?: string }): Promise<boolean> => {
     // if(!user) return false;
     try {
         await updateDoc(doc(db, 'tsia-custom-lists', listId, 'tsia-items', itemId), data);
         return true;
     } catch (error) {
         toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Η ενημέρωση του στοιχείου απέτυχε.' });
         return false;
     }
  }, [toast, user]);

  const deleteItem = useCallback(async (listId: string, itemId: string, itemValue: string): Promise<boolean> => {
    // if(!user) return false;
    const list = lists.find(l => l.id === listId);
    if (!list) return false;

    // The mapping from a user-friendly title to a db field is fragile.
    // A better approach would be to have a 'key' field on the list document.
    const contactField = listKeyToContactFieldMap[listId];

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
       return true;
    } catch (error) {
       toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Η διαγραφή του στοιχείου απέτυχε.' });
       return false;
    }
  }, [toast, user, lists]);
  

  return { lists, isLoading, isSubmitting, createList, updateList, deleteList, addItem, addNewItemToList, updateItem, deleteItem };
}
