
'use client';

import { useState, useCallback } from 'react';
import { useToast } from '@/shared/hooks/use-toast';
import { useAuth } from '@/shared/hooks/use-auth';
import { logActivity } from '@/shared/lib/logger';
import {
  createCustomList,
  updateCustomList,
  deleteCustomList,
  addItemsToCustomList,
  updateCustomListItem,
  deleteCustomListItem,
  checkListItemDependencies,
} from '@/lib/customListService';
import type { CreateListData } from '@/lib/customListService';

export function useCustomListActions(fetchAllLists: () => Promise<void>) {
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
            const listId = await createCustomList(listData);
            await logActivity('CREATE_LIST', { entityId: listId, entityType: 'custom-list', name: listData.title });
            return listId;
        },
        { successMessage: 'Η λίστα δημιουργήθηκε.', errorMessage: 'Η δημιουργία της λίστας απέτυχε.' }
    );
  }, [user, fetchAllLists, toast]);

  const updateList = useCallback(async (listId: string, data: Partial<CreateListData>) => {
      return withToastAndRefresh(
          () => updateCustomList(listId, data),
          { successMessage: 'Η λίστα ενημερώθηκε.', errorMessage: 'Η ενημέρωση απέτυχε.' }
      );
  }, [user, fetchAllLists, toast]);

  const deleteList = useCallback(async (listId: string, listTitle: string) => {
    if (!confirm(`Είστε σίγουροι ότι θέλετε να διαγράψετε τη λίστα "${listTitle}" και όλα τα περιεχόμενά της;`)) {
        return null;
    }
    return withToastAndRefresh(
        async () => {
            await deleteCustomList(listId);
            await logActivity('DELETE_LIST', { entityId: listId, entityType: 'custom-list', name: listTitle });
        },
        { successMessage: 'Η λίστα και όλα τα στοιχεία της διαγράφηκαν.', errorMessage: 'Η διαγραφή απέτυχε.'}
    );
  }, [user, fetchAllLists, toast]);

  const addItem = useCallback(async (listId: string, rawValue: string, hasCode?: boolean) => {
    return withToastAndRefresh(
        () => addItemsToCustomList(listId, rawValue, hasCode),
        { successMessage: `Τα στοιχεία προστέθηκαν.`, errorMessage: 'Η προσθήκη απέτυχε.'}
    );
  }, [user, fetchAllLists, toast]);

  const addNewItemToList = useCallback(async (listId: string, value: string, hasCode?: boolean, code?: string) => {
     if (!user) return null;
     
     // Check for duplicates before attempting to add.
     const list = (await getAllCustomLists()).find(l => l.id === listId);
     const isDuplicate = list?.items.some(item => item.value.toLowerCase() === value.toLowerCase() || (hasCode && item.code && code && item.code.toLowerCase() === code.toLowerCase()));
     
     if(isDuplicate){
         toast({ variant: 'destructive', title: 'Διπλότυπη Εγγραφή', description: 'Αυτό το στοιχείο υπάρχει ήδη σε αυτή τη λίστα.' });
         return null;
     }

     const success = await withToastAndRefresh(
         () => addItemsToCustomList(listId, code ? `${code} ${value}` : value, hasCode),
         { successMessage: `Το στοιχείο "${value}" προστέθηκε.`, errorMessage: 'Η προσθήκη απέτυχε.' }
     );
     
     return success ? value : null;
  }, [user, toast, fetchAllLists]);

  const updateItem = useCallback(async (listId: string, itemId: string, data: { value: string; code?: string }) => {
     return withToastAndRefresh(
         () => updateCustomListItem(listId, itemId, data),
         { successMessage: 'Το στοιχείο ενημερώθηκε.', errorMessage: 'Η ενημέρωση του στοιχείου απέτυχε.'}
     );
  }, [user, fetchAllLists, toast]);

  const deleteItem = useCallback(async (listId: string, listKey: string, itemId: string, itemValue: string) => {
    if (!user) return null;
    const dependency = await checkListItemDependencies(listKey, itemValue);
    if (dependency) {
        toast({
            variant: 'destructive',
            title: "Αδυναμία Διαγραφής",
            description: `Το στοιχείο "${itemValue}" χρησιμοποιείται από την επαφή: ${dependency}.`
        });
        return null;
    }
    
    return withToastAndRefresh(
        () => deleteCustomListItem(listId, itemId),
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
