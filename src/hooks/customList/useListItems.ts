
'use client';

import { useCallback } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useListWithFeedback } from './useListWithFeedback';
import {
  addItemsToCustomList,
  updateCustomListItem,
  deleteCustomListItem,
  checkListItemDependencies,
} from '@/shared/lib/customListService';
import { listIdToContactFieldMap } from './utils/listFieldMap';
import { hasAdminPermission } from './utils/checkPermissions';
import { useToast } from '../use-toast';

/**
 * Hook responsible for CRUD operations on list items (the children of a CustomList).
 * It encapsulates logic for adding, updating, and deleting individual items from a list.
 */
export function useListItems(fetchAllLists: () => Promise<void>) {
  const { user } = useAuth();
  const { toast } = useToast();
  const { withToastAndRefresh, isSubmitting } = useListWithFeedback(fetchAllLists);

  const addItem = useCallback(
    async (listId: string, rawValue: string, hasCode?: boolean) => {
      if (!hasAdminPermission(user)) return null;
      return withToastAndRefresh(() => addItemsToCustomList(listId, rawValue, hasCode), {
        successMessage: 'Τα στοιχεία προστέθηκαν.',
        errorMessage: 'Η προσθήκη απέτυχε.',
      });
    },
    [user, withToastAndRefresh]
  );

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
    [withToastAndRefresh]
  );

  const updateItem = useCallback(
    async (listId: string, itemId: string, data: { value: string; code?: string }) => {
      if (!hasAdminPermission(user)) return null;
      return withToastAndRefresh(() => updateCustomListItem(listId, itemId, data), {
        successMessage: 'Το στοιχείο ενημερώθηκε.',
        errorMessage: 'Η ενημέρωση του στοιχείου απέτυχε.',
      });
    },
    [user, withToastAndRefresh]
  );

  const deleteItem = useCallback(
    async (listId: string, itemId: string, itemValue: string) => {
      if (!hasAdminPermission(user)) return false;

      const contactField = listIdToContactFieldMap[listId];
      const dependency = await checkListItemDependencies(contactField, itemValue);

      if (dependency) {
        toast({
          variant: 'destructive',
          title: 'Αδυναμία Διαγραφής',
          description: `Το στοιχείο "${itemValue}" χρησιμοποιείται από την επαφή: ${dependency}.`,
          duration: 5000,
        });
        return false;
      }

      if (!confirm(`Είστε σίγουροι ότι θέλετε να διαγράψετε το στοιχείο "${itemValue}"`)) {
        return false;
      }

      const result = await withToastAndRefresh(() => deleteCustomListItem(listId, itemId), {
        successMessage: `Το στοιχείο "${itemValue}" διαγράφηκε.`,
        errorMessage: 'Η διαγραφή του στοιχείου απέτυχε.',
      });

      return result !== null;
    },
    [user, withToastAndRefresh, toast]
  );

  return {
    isSubmitting,
    addItem,
    addNewItemToList,
    updateItem,
    deleteItem,
  };
}
