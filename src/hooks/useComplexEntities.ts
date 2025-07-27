
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  collection,
  query,
  orderBy,
  startAfter,
  limit,
  getDocs,
  DocumentData,
  QueryDocumentSnapshot,
  where,
  endBefore,
  limitToLast,
  getCountFromServer,
  QueryConstraint
} from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';
import { useDebounce } from 'use-debounce';

export interface ComplexEntity {
  id: string;
  type: string;
  [key: string]: any; 
}

const PAGE_SIZE = 50;

async function getDistinctTypes(): Promise<string[]> {
    const q = query(collection(db, 'tsia-complex-entities'), orderBy('type'));
    const snapshot = await getDocs(q);
    const types = new Set<string>();
    snapshot.forEach(doc => {
        const type = doc.data().type;
        if (type) {
            types.add(type);
        }
    });
    return Array.from(types).sort();
}


export function useComplexEntities(type?: string, columnFilters: Record<string, string> = {}) {
  const [entities, setEntities] = useState<ComplexEntity[]>([]);
  const [listTypes, setListTypes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingListTypes, setIsLoadingListTypes] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [firstVisible, setFirstVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState<number | null>(null);

  const [debouncedFilters] = useDebounce(columnFilters, 500);

  const fetchListTypes = useCallback(async () => {
    setIsLoadingListTypes(true);
    try {
        const types = await getDistinctTypes();
        setListTypes(types);
    } catch(err) {
        console.error("Failed to fetch list types", err);
        setError("Αδυναμία φόρτωσης τύπων λίστας.");
    } finally {
        setIsLoadingListTypes(false);
    }
  }, []);

  useEffect(() => {
    fetchListTypes();
  }, [fetchListTypes]);


  const fetchEntities = useCallback(async (direction: 'next' | 'prev' | 'initial' = 'initial') => {
      if (!type) {
        setEntities([]);
        setTotalCount(0);
        return;
      }
      setIsLoading(true);
      setError(null);
      
      try {
        let constraints: QueryConstraint[] = [where('type', '==', type)];

        // Add constraints for column filters
        for (const key in debouncedFilters) {
            const value = debouncedFilters[key];
            if (value) {
                // Use a "starts-with" query, which is efficient in Firestore
                constraints.push(where(key, '>=', value));
                constraints.push(where(key, '<=', value + '\uf8ff'));
            }
        }
        
        const countQuery = query(collection(db, 'tsia-complex-entities'), ...constraints);
        const countSnapshot = await getCountFromServer(countQuery);
        setTotalCount(countSnapshot.data().count);
        
        let finalQuery;
        const baseQuery = collection(db, 'tsia-complex-entities');
        
        // Add sorting. Firestore requires the first orderBy to be on the field used in inequality filters.
        const firstInequalityFilter = Object.keys(debouncedFilters).find(k => debouncedFilters[k]);
        if(firstInequalityFilter) {
            constraints.push(orderBy(firstInequalityFilter));
        }
        constraints.push(orderBy('__name__')); // Sort by doc ID for consistent pagination

        switch (direction) {
          case 'next':
            if(lastVisible) constraints.push(startAfter(lastVisible));
            constraints.push(limit(PAGE_SIZE));
            break;
          case 'prev':
             if (firstVisible) {
                constraints.push(endBefore(firstVisible), limitToLast(PAGE_SIZE));
             } else {
                 constraints.push(limit(PAGE_SIZE));
             }
            break;
          default: // 'initial'
            constraints.push(limit(PAGE_SIZE));
            break;
        }

        finalQuery = query(baseQuery, ...constraints);
        
        const documentSnapshots = await getDocs(finalQuery);
        
        let newEntities = documentSnapshots.docs.map(doc => ({ id: doc.id, ...doc.data() } as ComplexEntity));
        
        setLastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1] || null);
        setFirstVisible(documentSnapshots.docs[0] || null);
        
        setEntities(newEntities);

      } catch (err: any) {
        console.error('Error fetching complex entities:', err);
        setError('Αποτυχία φόρτωσης δεδομένων. Βεβαιωθείτε ότι το απαραίτητο ευρετήριο έχει δημιουργηθεί στο Firebase Console. ' + err.message);
      } finally {
        setIsLoading(false);
      }
    },
    [type, debouncedFilters, lastVisible, firstVisible]
  );
  
  const refetch = useCallback(() => {
    setPage(1);
    setLastVisible(null);
    setFirstVisible(null);
    // Directly call fetchEntities instead of waiting for useEffect
    if (type) {
      fetchEntities('initial');
    }
  }, [type, fetchEntities]);

  useEffect(() => {
    refetch();
  }, [type, debouncedFilters, refetch]);

  const nextPage = useCallback(() => {
    if(!lastVisible) return;
    setPage(p => p + 1);
    fetchEntities('next');
  }, [fetchEntities, lastVisible]);

  const prevPage = useCallback(() => {
    if (page > 1) {
      setPage(p => p - 1);
      fetchEntities('prev');
    }
  }, [page, fetchEntities]);
  
  const canGoNext = entities.length === PAGE_SIZE && (page * PAGE_SIZE) < (totalCount || 0);

  return {
    entities,
    isLoading,
    error,
    listTypes,
    isLoadingListTypes,
    refetch,
    nextPage,
    prevPage,
    canGoNext,
    canGoPrev: page > 1,
    totalCount,
  };
}
