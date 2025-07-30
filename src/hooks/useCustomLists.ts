
'use client';

import { useState, useCallback, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { CustomList, ListItem } from '@/lib/customListService';

export function useCustomLists() {
    const [lists, setLists] = useState<CustomList[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchAllLists = useCallback(() => {
        setIsLoading(true);
        const q = query(collection(db, 'tsia-custom-lists'), orderBy('title', 'asc'));

        const unsubscribe = onSnapshot(q, async (querySnapshot) => {
            try {
                const listsDataPromises = querySnapshot.docs.map(async (listDoc) => {
                    const listData = { id: listDoc.id, ...listDoc.data() } as CustomList;
                    
                    const itemsQuery = query(collection(listDoc.ref, 'tsia-items'), orderBy('value', 'asc'));
                    const itemsSnapshot = await onSnapshot(collection(listDoc.ref, 'tsia-items'), (snapshot) => {
                        listData.items = snapshot.docs.map(itemDoc => ({ id: itemDoc.id, ...itemDoc.data() } as ListItem));
                    });

                    // This part is tricky with onSnapshot. We'll rely on the initial fetch for items.
                    // For real-time updates of items, a more complex state management (e.g., Zustand, Redux) would be better.
                    const itemsSnapshotInitial = await getDocs(itemsQuery);
                    listData.items = itemsSnapshotInitial.docs.map(itemDoc => ({ id: itemDoc.id, ...itemDoc.data() } as ListItem));
                    
                    return listData;
                });

                const resolvedLists = await Promise.all(listsDataPromises);
                setLists(resolvedLists);
            } catch (err) {
                console.error("Error processing lists data:", err);
                setError(err instanceof Error ? err : new Error('An unknown error occurred'));
            } finally {
                setIsLoading(false);
            }
        }, (err) => {
            console.error("Error fetching custom lists:", err);
            setError(err);
            setIsLoading(false);
        });

        // The returned function can be used for cleanup if the component unmounts.
        return unsubscribe;
    }, []);
    
    useEffect(() => {
        const unsubscribe = fetchAllLists();
        return () => {
            if (unsubscribe) {
                // To-do: properly handle cleanup if needed.
                // For now, onSnapshot will continue listening until the user navigates away.
            }
        };
    }, [fetchAllLists]);


    return { lists, isLoading, fetchAllLists };
}
