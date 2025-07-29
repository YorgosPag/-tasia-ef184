
'use client';

import { useState, useCallback } from 'react';
import { useToast } from '@/shared/hooks/use-toast';
import { useAuth } from '@/shared/hooks/use-auth';
import { logActivity } from '@/shared/lib/logger';
import {
  createCustomList as createCustomListService,
  updateCustomList as updateCustomListService,
  deleteCustomList as deleteCustomListService,
  addItemsToCustomList,
  updateCustomListItem,
  deleteCustomListItem,
  checkListItemDependencies,
  checkListDependencies,
} from '@/lib/customListService';
import type { CreateListData, CustomList } from '@/lib/customListService';

const listIdToContactFieldMap: Record<string, string> = {
  'hOKgJ1K2k8g7e9Y3d1t5': 'job.role',
  'fLpWc4e8gH2jK1n7m0p3': 'job.specialty',
  'bC9eF1g3h5i7k9l0m2n4': 'doy',
  'jIt8lRiNcgatSchI90yd': 'identity.type',
  'iGOjn86fcktREwMeDFPz': 'identity.issuingAuthority',
};

export function useCustomListActions(fetchAllLists: () => Promise<void>) {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const withToastAndRefresh = async <T,>(
    operation: () => Promise<T>,
    {
      successMessage,
      errorMessage,
      onFinally,
    }: {
      successMessage: string;
      errorMessage: string;
      onFinally?: () => void;
    }
  ): Promise<T | null> => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Σφάλμα',
        description: 'Δεν έχετε δικαίωμα για αυτή την ενέργεια.',
      });
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
      toast({
        variant: 'destructive',
        title: 'Σφάλμα',
        description: `${errorMessage}: ${(error as Error).message}`,
      });
      return null;
    } finally {
      setIsSubmitting(false);
      onFinally?.();
    }
  };

  const createList = useCallback(async (listData: CreateListData) => {
    return withToastAndRefresh(
      async () => {
        const listId = await createCustomListService(listData);
        await logActivity('CREATE_LIST', {
          entityId: listId,
          entityType: 'custom-list',
          name: listData.title,
        });
        return listId;
      },
      {
        successMessage: 'Η λίστα δημιουργήθηκε.',
        errorMessage: 'Η δημιουργία της λίστας απέτυχε.',
      }
    );
  }, [user, fetchAllLists, toast]);

  const updateList = useCallback(async (listId: string, data: Partial<CreateListData>) => {
    return withToastAndRefresh(
      () => updateCustomListService(listId, data),
      {
        successMessage: 'Η λίστα ενημερώθηκε.',
        errorMessage: 'Η ενημέρωση απέτυχε.',
      }
    );
  }, [user, fetchAllLists, toast]);

  const deleteList = useCallback(async (list: CustomList) => {
    if (!isAdmin) {
        toast({variant: 'destructive', title: 'Σφάλμα', description: 'Δεν έχετε δικαιώματα για διαγραφή.'});
        return null;
    };

    const contactField = listIdToContactFieldMap[list.id];
    if (contactField) {
      const dependencies = await checkListDependencies(contactField, list.items.map((item) => item.value));
      if (dependencies.length > 0) {
        const examples = dependencies
          .slice(0, 2)
          .map((d) => `"${d.value}" στην επαφή "${d.contactName}"`)
          .join(', ');
        const warningMessage = `Η λίστα "${list.title}" χρησιμοποιείται σε ενεργά σημεία. Ενδεικτικά: ${examples}${dependencies.length > 2 ? '...' : ''}.`;
        
        if (!confirm(`${warningMessage}\n\nΕίστε σίγουρος ότι θέλετε να συνεχίσετε;`)) {
            return null;
        }
      }
    }
    
    // Fallback confirmation for lists without dependency checks
    if (!contactField) {
        if (!confirm(`Είστε σίγουροι ότι θέλετε να διαγράψετε τη λίστα "${list.title}" και όλα τα περιεχόμενά της;`)) {
            return null;
        }
    }

    return withToastAndRefresh(
      async () => {
        await deleteCustomListService(list.id);
        await logActivity('DELETE_LIST', {
          entityId: list.id,
          entityType: 'custom-list',
          name: list.title,
        });
      },
      {
        successMessage: 'Η λίστα και όλα τα στοιχεία της διαγράφηκαν.',
        errorMessage: 'Η διαγραφή απέτυχε.',
      }
    );
  }, [isAdmin, fetchAllLists, toast]);

  const addItem = useCallback(async (listId: string, rawValue: string, hasCode?: boolean) => {
    return withToastAndRefresh(
      () => addItemsToCustomList(listId, rawValue, hasCode),
      {
        successMessage: `Τα στοιχεία προστέθηκαν.`,
        errorMessage: 'Η προσθήκη απέτυχε.',
      }
    );
  }, [user, fetchAllLists, toast]);

  const addNewItemToList = useCallback(
    async (listId: string, value: string, hasCode?: boolean, code?: string) => {
      const success = await withToastAndRefresh(
        () => addItemsToCustomList(listId, code ? `${code} ${value}` : value, hasCode),
        {
          successMessage: `Το στοιχείο "${value}" προστέθηκε.`,
          errorMessage: 'Η προσθήκη απέτυχε.',
        }
      );

      return success ? value : null;
    },
    [user, toast, fetchAllLists]
  );

  const updateItem = useCallback(
    async (listId: string, itemId: string, data: { value: string; code?: string }) => {
      return withToastAndRefresh(
        () => updateCustomListItem(listId, itemId, data),
        {
          successMessage: 'Το στοιχείο ενημερώθηκε.',
          errorMessage: 'Η ενημέρωση του στοιχείου απέτυχε.',
        }
      );
    },
    [user, fetchAllLists, toast]
  );

  const deleteItem = useCallback(
    async (listId: string, itemId: string, itemValue: string) => {
      if (!user) return false;

      const dependency = await checkListItemDependencies(listIdToContactFieldMap[listId], itemValue);
      if (dependency) {
        toast({
          variant: 'destructive',
          title: 'Αδυναμία Διαγραφής',
          description: `Το στοιχείο "${itemValue}" χρησιμοποιείται από την επαφή: ${dependency}.`,
          duration: 5000,
        });
        return false;
      }
      
      const confirmed = confirm(`Είστε σίγουροι ότι θέλετε να διαγράψετε το στοιχείο "${itemValue}"`);
      if(!confirmed) return false;

      const result = await withToastAndRefresh(
        () => deleteCustomListItem(listId, itemId),
        {
          successMessage: `Το στοιχείο "${itemValue}" διαγράφηκε.`,
          errorMessage: 'Η διαγραφή του στοιχείου απέτυχε.',
        }
      );

      return result !== null;
    },
    [user, fetchAllLists, toast]
  );

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
