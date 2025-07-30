
'use client';

import { useListCrud } from '@/hooks/customList/useListCrud';
import { useListItems } from '@/hooks/customList/useListItems';

/**
 * A composite hook that orchestrates all actions related to custom lists and their items.
 * It combines the functionality from `useListCrud` and `useListItems` to provide a single,
 * unified interface for components to interact with custom list data.
 *
 * @param fetchAllLists A callback function to refresh the entire list data after an operation.
 * @returns An object containing all possible actions and state related to custom lists.
 */
export function useCustomListActions(fetchAllLists: () => Promise<void>) {
  const { isSubmitting: isListSubmitting, ...listCrud } = useListCrud(fetchAllLists);
  const { isSubmitting: isItemSubmitting, ...listItems } = useListItems(fetchAllLists);

  return {
    isSubmitting: isListSubmitting || isItemSubmitting,
    ...listCrud,
    ...listItems,
  };
}
