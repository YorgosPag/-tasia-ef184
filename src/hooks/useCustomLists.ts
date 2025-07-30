
'use client';

import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { CustomList, ListItem } from '@/lib/customListService';

async function fetchAllCustomLists(): Promise<CustomList[]> {
    const listsQuery = query(collection(db, 'tsia-custom-lists'), orderBy('title', 'asc'));
    const listsSnapshot = await getDocs(listsQuery);

    const listsDataPromises = listsSnapshot.docs.map(async (listDoc) => {
        const list = { id: listDoc.id, ...listDoc.data() } as CustomList;
        const itemsQuery = query(collection(listDoc.ref, 'tsia-items'), orderBy('value', 'asc'));
        const itemsSnapshot = await getDocs(itemsQuery);
        list.items = itemsSnapshot.docs.map(itemDoc => ({ id: itemDoc.id, ...itemDoc.data() } as ListItem));
        return list;
    });

    return Promise.all(listsDataPromises);
}

export function useCustomLists() {
    const { 
        data: lists = [], 
        isLoading, 
        isError: error, 
        refetch: fetchAllLists 
    } = useQuery<CustomList[]>({
        queryKey: ['customLists'],
        queryFn: fetchAllCustomLists,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    return { lists, isLoading, error, fetchAllLists };
}
