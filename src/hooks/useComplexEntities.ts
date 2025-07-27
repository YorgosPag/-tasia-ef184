
'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
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
  getCountFromServer
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


export function useComplexEntities(type?: string) {
  const [entities, setEntities] = useState<ComplexEntity[]>([]);
  const [listTypes, setListTypes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingListTypes, setIsLoadingListTypes] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pagination state
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [firstVisible, setFirstVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState<number | null>(null);

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
        let constraints = [where('type', '==', type), orderBy('__name__')];
        
        const countQuery = query(collection(db, 'tsia-complex-entities'), where('type', '==', type));
        const countSnapshot = await getCountFromServer(countQuery);
        setTotalCount(countSnapshot.data().count);
        
        let q;
        const finalConstraints = [...constraints, limit(PAGE_SIZE)];

        switch (direction) {
          case 'next':
            if(lastVisible) finalConstraints.push(startAfter(lastVisible));
            break;
          case 'prev':
             if (firstVisible) {
                const prevConstraints = [...constraints, limitToLast(PAGE_SIZE), endBefore(firstVisible)];
                q = query(collection(db, 'tsia-complex-entities'), ...prevConstraints);
             } else {
                q = query(collection(db, 'tsia-complex-entities'), ...finalConstraints);
             }
            break;
          default: // 'initial'
            q = query(collection(db, 'tsia-complex-entities'), ...finalConstraints);
            break;
        }

        if(!q) q = query(collection(db, 'tsia-complex-entities'), ...finalConstraints);
        
        const documentSnapshots = await getDocs(q);
        
        let newEntities = documentSnapshots.docs.map(doc => ({ id: doc.id, ...doc.data() } as ComplexEntity));
        
        setLastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1] || null);
        setFirstVisible(documentSnapshots.docs[0] || null);
        
        setEntities(newEntities);

      } catch (err: any) {
        console.error('Error fetching complex entities:', err);
        setError('Αποτυχία φόρτωσης δεδομένων. Βεβαιωθείτε ότι το απαραίτητο ευρετήριο έχει δημιουργηθεί στο Firebase Console.');
      } finally {
        setIsLoading(false);
      }
    },
    [type, lastVisible, firstVisible]
  );
  
  const refetch = useCallback(() => {
    setPage(1);
    setLastVisible(null);
    setFirstVisible(null);
    fetchEntities('initial');
  }, [fetchEntities]);

  useEffect(() => {
    refetch();
  }, [type]);

  const nextPage = useCallback(() => {
    setPage(p => p + 1);
    fetchEntities('next');
  }, [fetchEntities]);

  const prevPage = useCallback(() => {
    if (page > 1) {
      setPage(p => p - 1);
      fetchEntities('prev');
    }
  }, [page, fetchEntities]);
  
  const filteredEntities = useMemo(() => {
    if (!searchQuery) return entities;
    const lowercasedQuery = searchQuery.toLowerCase();
    return entities.filter(entity => {
      // Search through all values of the entity
      return Object.values(entity).some(value =>
        String(value).toLowerCase().includes(lowercasedQuery)
      );
    });
  }, [entities, searchQuery]);

  const canGoNext = entities.length === PAGE_SIZE && (page * PAGE_SIZE) < (totalCount || 0);

  return {
    entities: filteredEntities,
    isLoading: isLoading,
    error,
    searchQuery,
    setSearchQuery,
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
