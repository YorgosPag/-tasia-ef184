
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  collection,
  query,
  getDocs,
  orderBy,
  limit,
  startAfter,
  where,
  QueryConstraint,
  DocumentData,
  QueryDocumentSnapshot,
  getCountFromServer,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

// --- Interfaces & Constants ---
export interface ComplexEntity {
  id: string;
  type: string;
  [key: string]: any;
}
export const PAGE_SIZE = 50;

// --- Helper Functions ---

/**
 * Creates an array of Firestore query constraints based on the active filters.
 */
const createFilterConstraints = (
  listType: string,
  filters: Record<string, string>
): QueryConstraint[] => {
  const constraints: QueryConstraint[] = [where('type', '==', listType)];
  for (const key in filters) {
    if (filters[key]) {
      constraints.push(where(key, '==', filters[key]));
    }
  }
  return constraints;
};


// --- Data Fetching Functions ---

/**
 * Fetches a single page of complex entities from Firestore.
 */
async function fetchEntitiesPage(
  listType: string,
  filters: Record<string, string>,
  lastDoc: QueryDocumentSnapshot<DocumentData> | null
): Promise<{ entities: ComplexEntity[]; lastDoc: QueryDocumentSnapshot<DocumentData> | null }> {
  // Prevent query if listType is not selected
  if (!listType || listType.trim() === '') {
    return { entities: [], lastDoc: null };
  }

  const constraints = createFilterConstraints(listType, filters);
  const entitiesQuery = query(
    collection(db, 'tsia-complex-entities'),
    ...constraints,
    orderBy('__name__'), // Order by document ID for consistent pagination
    ...(lastDoc ? [startAfter(lastDoc)] : []),
    limit(PAGE_SIZE)
  );

  const snapshot = await getDocs(entitiesQuery);
  const entities = snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as ComplexEntity)
  );

  return { entities, lastDoc: snapshot.docs[snapshot.docs.length - 1] || null };
}

/**
 * Fetches all distinct values for a given field within a specific list type.
 */
async function fetchDistinctValues(listType: string, field: string): Promise<string[]> {
    if (!listType || !field) return [];
    // This is a client-side implementation for fetching distinct values.
    // For large datasets, a server-side function (e.g., Cloud Function) would be more efficient.
    const q = query(collection(db, 'tsia-complex-entities'), where('type', '==', listType));
    const snapshot = await getDocs(q);
    const values = new Set<string>();
    snapshot.forEach(doc => {
        const value = doc.data()[field];
        if (value && typeof value === 'string') {
            values.add(value);
        }
    });
    return Array.from(values).sort();
}


// --- Main Hook ---

export function useComplexEntities(listType: string, filters: Record<string, string>) {
  const [page, setPage] = useState(1);
  const [lastDocs, setLastDocs] = useState<(QueryDocumentSnapshot<DocumentData> | null)[]>([null]);
  const [isLoading, setIsLoading] = useState(true);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [distinctValues, setDistinctValues] = useState<Record<string, string[]>>({});
  
  const filterKey = JSON.stringify(filters); // Create a stable key for the filter object

  const { data: pageData, isFetching, refetch } = useQuery({
    queryKey: ['complexEntities', listType, filterKey, page],
    queryFn: async () => {
        if (!listType || listType.trim() === '') {
            return { entities: [], lastDoc: null };
        };
        const lastDocForPage = lastDocs[page - 1] || null;
        const result = await fetchEntitiesPage(listType, filters, lastDocForPage);
        
        if (page === 1 && !initialDataLoaded) {
            const countQuery = query(collection(db, 'tsia-complex-entities'), ...createFilterConstraints(listType, filters));
            const countSnapshot = await getCountFromServer(countQuery);
            setTotalCount(countSnapshot.data().count);
            setInitialDataLoaded(true);
        }

        if (result.lastDoc && page === lastDocs.length - 1) {
            setLastDocs(prev => [...prev, result.lastDoc]);
        }
        return result;
    },
    staleTime: 5 * 60 * 1000,
  } as UseQueryOptions<{ entities: ComplexEntity[]; lastDoc: QueryDocumentSnapshot<DocumentData> | null }, Error>);

  useEffect(() => {
    // Reset pagination and data when listType or filters change
    setPage(1);
    setLastDocs([null]);
    setInitialDataLoaded(false);
    setTotalCount(null);
    // No need to refetch here, the query key change will trigger it.
  }, [listType, filterKey]);


  useEffect(() => {
      // Fetch distinct values for the first 5 columns when listType changes
    if (listType) {
        const fetchInitialDistinctValues = async () => {
            const tempEntitiesSnapshot = await getDocs(query(collection(db, 'tsia-complex-entities'), where('type', '==', listType), limit(1)));
            if (tempEntitiesSnapshot.empty) {
                setDistinctValues({});
                return;
            };
            const firstItem = tempEntitiesSnapshot.docs[0].data();
            const keys = Object.keys(firstItem).filter(key => !['id', 'type', 'createdAt', 'uniqueKey'].includes(key)).slice(0, 10);
            
            const newDistinctValues: Record<string, string[]> = {};
            for (const key of keys) {
                newDistinctValues[key] = await fetchDistinctValues(listType, key);
            }
            setDistinctValues(newDistinctValues);
        };
        fetchInitialDistinctValues();
    }
  }, [listType]);

  const nextPage = () => {
    if (!isFetching && pageData?.lastDoc) {
        setPage(p => p + 1);
    }
  };

  const prevPage = () => {
    if (page > 1) {
      setPage(p => p - 1);
    }
  };
  
  const canGoNext = pageData?.lastDoc !== null && (totalCount !== null ? (page * PAGE_SIZE < totalCount) : true);
  const canGoPrev = page > 1;

  return {
    entities: pageData?.entities ?? [],
    isLoading: isFetching,
    refetch,
    nextPage,
    prevPage,
    canGoNext,
    canGoPrev,
    page,
    totalCount,
    initialDataLoaded,
    distinctValues
  };
}
