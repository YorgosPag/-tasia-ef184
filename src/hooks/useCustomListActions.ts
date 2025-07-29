'use client';

import { useListCrud } from './customList/useListCrud';
import { useListItems } from './customList/useListItems';
import { useCustomLists } from './useCustomLists';


/**
 * A composite hook that orchestrates all actions related to custom lists and their items.
 * It combines the functionality of `useListCrud` and `useListItems` to provide a single,
 * cohesive API for components to use.
 *
 * This hook is meant to be the single entry point for any component that needs to modify custom list data.
 * @param {() => Promise<void>} [fetchAllLists] - An optional callback to refresh the list data, passed down from the UI layer.
 */
export function useCustomListActions(fetchAllLists?: () => Promise<void>) {
  // If no refresh function is provided, create a dummy one to avoid errors.
  const refreshLists = fetchAllLists || (async () => {});

  const { isSubmitting: isCrudSubmitting, ...listCrud } = useListCrud(refreshLists);
  const { isSubmitting: isItemSubmitting, ...listItems } = useListItems(refreshLists);

  return {
    ...listCrud,
    ...listItems,
    isSubmitting: isCrudSubmitting || isItemSubmitting,
  };
}
