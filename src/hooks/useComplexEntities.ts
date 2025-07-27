
'use client';

import { useState, useEffect, useCallback } from 'react';
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
} from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';
import { useDebounce } from 'use-debounce';

export interface ComplexEntity {
  id: string;
  type: string;
  [key: string]: any; // Allow any other string keys with any value type
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


export function useComplexEntities(type?: string) {
  const [entities, setEntities] = useState<ComplexEntity[]>([]);
  const [listTypes, setListTypes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingListTypes, setIsLoadingListTypes] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);

  const [firstVisible, setFirstVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  const fetchListTypes = useCallback(async () => {
    setIsLoadingListTypes(true);
    try {
        const types = await getDistinctTypes();
        setListTypes(types);
    } catch(err) {
        console.error("Failed to fetch list types", err);
        setError("Αδυναμία φόρτωσης τύπων λίστας. Βεβαιωθείτε ότι το απαραίτητο ευρετήριο έχει δημιουργηθεί στο Firebase Console.");
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
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        let constraints = [where('type', '==', type), limit(PAGE_SIZE + 1)]; // Fetch one extra to check for next page

        if (direction === 'next' && lastVisible) {
            constraints.push(startAfter(lastVisible));
        } else if (direction === 'prev' && firstVisible) {
            // Firestore doesn't have a simple previous page query, so we reverse the query
            constraints = [where('type', '==', type), limitToLast(PAGE_SIZE), endBefore(firstVisible)];
        } else {
             // Initial fetch
        }

        const q = query(collection(db, 'tsia-complex-entities'), ...constraints);
        
        const documentSnapshots = await getDocs(q);
        
        const newEntities = documentSnapshots.docs.map(doc => ({ id: doc.id, ...doc.data() } as ComplexEntity));
        
        const hasMore = newEntities.length > PAGE_SIZE;
        if (hasMore) {
            newEntities.pop(); // Remove the extra document
        }

        if (direction === 'prev' && documentSnapshots.docs.length < PAGE_SIZE) {
            // We are at the first page
        }

        setEntities(newEntities);
        setHasNextPage(hasMore);

        setFirstVisible(documentSnapshots.docs[0] || null);
        setLastVisible(documentSnapshots.docs[documentSnapshots.docs.length - (hasMore ? 2 : 1)] || null);
        
      } catch (err: any) {
        console.error('Error fetching complex entities:', err);
        setError('Αποτυχία φόρτωσης δεδομένων. Βεβαιωθείτε ότι το απαραίτητο ευρετήριο έχει δημιουργηθεί στο Firebase Console.');
      } finally {
        setIsLoading(false);
      }
    },
    [type, debouncedSearchQuery, lastVisible, firstVisible]
  );
  
  const refetch = useCallback(() => {
    setPage(1);
    setFirstVisible(null);
    setLastVisible(null);
    fetchEntities('initial');
  }, [fetchEntities]);

  useEffect(() => {
    setPage(1);
    setFirstVisible(null);
    setLastVisible(null);
    if(type) {
        fetchEntities('initial');
    } else {
        setEntities([]);
    }
  }, [type, debouncedSearchQuery]); // Removed fetchEntities from dependency array
  
  const nextPage = () => {
      if (hasNextPage) {
          setPage(p => p + 1);
          fetchEntities('next');
      }
  };

  const prevPage = () => {
      if (page > 1) {
          setPage(p => p - 1);
          fetchEntities('prev');
      }
  };

  return {
    entities,
    isLoading: isLoading,
    error,
    searchQuery,
    setSearchQuery,
    listTypes,
    isLoadingListTypes,
    refetch,
    nextPage,
    prevPage,
    canGoNext: hasNextPage,
    canGoPrev: page > 1,
  };
}
