'use client';

import { useState, useCallback } from 'react';
import { useToast } from '@/shared/hooks/use-toast';

/**
 * A helper hook that wraps an async operation with common feedback patterns:
 * - Sets a submitting state.
 * - Displays a success or error toast message.
 * - Refreshes the data list on success.
 * This abstracts away boilerplate from the primary action hooks.
 */
export function useListWithFeedback(fetchAllLists: () => Promise<void>) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const withToastAndRefresh = useCallback(
    async <T,>(
      operation: () => Promise<T>,
      {
        successMessage,
        errorMessage,
      }: {
        successMessage: string;
        errorMessage: string;
      }
    ): Promise<T | null> => {
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
      }
    },
    [fetchAllLists, toast]
  );

  return { isSubmitting, withToastAndRefresh };
}
