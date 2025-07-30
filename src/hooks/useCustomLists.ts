
'use client';

import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllCustomLists, type CustomList } from '@/shared/lib/customListService';


async function fetchAllListsData(): Promise<CustomList[]> {
    try {
        const lists = await getAllCustomLists();
        return lists;
    } catch (error) {
        console.error("Failed to fetch custom lists:", error);
        // Return an empty array or re-throw, depending on desired error handling.
        // For useQuery, throwing the error is often better.
        throw new Error("Could not fetch custom lists.");
    }
}


export function useCustomLists() {
    const { data: lists = [], isLoading, refetch } = useQuery<CustomList[]>({
      queryKey: ['customLists'],
      queryFn: fetchAllListsData,
      staleTime: 1000 * 60 * 5, // 5 minutes
    });

    const fetchAllLists = useCallback(async () => {
        await refetch();
    }, [refetch]);

    return { lists, isLoading, fetchAllLists };
}
