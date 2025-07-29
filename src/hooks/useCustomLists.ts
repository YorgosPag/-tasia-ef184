
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/shared/hooks/use-toast';
import { getAllCustomLists } from '@/lib/customListService';
import type { CustomList } from '@/lib/customListService';


/**
 * A custom hook to fetch and manage the state of all custom lists.
 * It provides the lists, loading state, and a function to manually refetch the data.
 */
export function useCustomLists() {
  const { toast } = useToast();
  const [lists, setLists] = useState<CustomList[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAllLists = useCallback(async () => {
    setIsLoading(true);
    try {
      const listsData = await getAllCustomLists();
      setLists(listsData);
    } catch (error) {
       console.error("Error fetching lists manually:", error);
       toast({ variant: 'destructive', title: 'Σφάλμα Φόρτωσης', description: 'Failed to fetch list data.' });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchAllLists();
  }, [fetchAllLists]);

  return { lists, isLoading, fetchAllLists };
}
