
'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  query,
  orderBy,
  getDocs,
} from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';
import { useToast } from '@/shared/hooks/use-toast';

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

// --- Custom Hook for Data Fetching ---

export function useCustomLists() {
  const { toast } = useToast();
  const [lists, setLists] = useState<CustomList[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAllLists = useCallback(async () => {
    setIsLoading(true);
    try {
      const listsQuery = query(collection(db, 'tsia-custom-lists'), orderBy('title', 'asc'));
      const listsSnapshot = await getDocs(listsQuery);
      
      const listsDataPromises = listsSnapshot.docs.map(async (listDoc) => {
        const list = { id: listDoc.id, ...listDoc.data() } as CustomList;
        const itemsQuery = query(collection(listDoc.ref, 'tsia-items'), orderBy('value', 'asc'));
        const itemsSnapshot = await getDocs(itemsQuery);
        list.items = itemsSnapshot.docs.map(itemDoc => ({ id: itemDoc.id, ...itemDoc.data() } as ListItem));
        return list;
      });

      const listsData = await Promise.all(listsDataPromises);
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
