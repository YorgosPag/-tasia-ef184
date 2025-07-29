'use client';

import { useCallback } from 'react';
import { useAuth } from '@/shared/hooks/use-auth';
import { logActivity } from '@/shared/lib/logger';
import {
  createCustomList as createCustomListService,
  updateCustomList as updateCustomListService,
  deleteCustomList as deleteCustomListService,
  checkListDependencies,
} from '@/lib/customListService';
import { useListWithFeedback } from './useListWithFeedback';
import { listIdToContactFieldMap } from './utils/listFieldMap';
import type { CreateListData, CustomList } from '@/lib/customListService';
import { hasAdminPermission } from './utils/checkPermissions';
import { useToast } from '@/shared/hooks/use-toast';

/**
 * Hook responsible for CRUD (Create, Read, Update, Delete) operations on the main `CustomList` entities.
 * It encapsulates logic for list creation, updates, and deletion, including permission checks and dependency validations.
 */
export function useListCrud(fetchAllLists: () => Promise<void>) {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const { withToastAndRefresh, isSubmitting } = useListWithFeedback(fetchAllLists);

  const createList = useCallback(
    async (listData: CreateListData) => {
      if (!hasAdminPermission(user)) return null;

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
    },
    [user, withToastAndRefresh]
  );

  const updateList = useCallback(
    async (listId: string, data: Partial<CreateListData>) => {
      if (!hasAdminPermission(user)) return null;
      return withToastAndRefresh(() => updateCustomListService(listId, data), {
        successMessage: 'Η λίστα ενημερώθηκε.',
        errorMessage: 'Η ενημέρωση απέτυχε.',
      });
    },
    [user, withToastAndRefresh]
  );

  const deleteList = useCallback(
    async (list: CustomList) => {
      if (!isAdmin) {
        toast({
          variant: 'destructive',
          title: 'Σφάλμα',
          description: 'Δεν έχετε δικαιώματα για διαγραφή.',
        });
        return null;
      }

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
      } else {
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
    },
    [isAdmin, user, toast, withToastAndRefresh]
  );

  return {
    isSubmitting,
    createList,
    updateList,
    deleteList,
  };
}
