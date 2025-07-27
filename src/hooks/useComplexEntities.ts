'use client';

import { useState, useEffect, useCallback, useReducer, Dispatch } from 'react';
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
  QueryConstraint,
  endBefore,
  limitToLast,
} from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';
import { useDebounce } from 'use-debounce';

// --- Interfaces & Types ---
export interface ComplexEntity {
  id: string;
  type: string;
  [key: string]: any;
}

export const PAGE_SIZE = 50;

interface State {
  entities: ComplexEntity[];
  listTypes: string[];
  isLoading: boolean;
  isLoadingListTypes: boolean;
  error: string | null;
  page: number;
  pageDocs: (QueryDocumentSnapshot<DocumentData> | null)[];
  totalCount: number | null;
  initialDataLoaded: boolean;
  allKeysFromType: string[];
}

type Action =
  | { type: 'FETCH_INIT' }
  | { type: 'FETCH_TYPES_SUCCESS'; payload: string[] }
  | { type: 'FETCH_DATA_SUCCESS'; payload: { entities: ComplexEntity[]; newKeys: string[]; lastDoc: QueryDocumentSnapshot<DocumentData> | null; hasMore: boolean } }
  | { type: 'FETCH_FAILURE'; payload: string }
  | { type: 'RESET_STATE'; payload: { type?: string } }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'SET_PAGINATION_DOCS'; payload: { page: number; doc: QueryDocumentSnapshot<DocumentData> | null }};

// --- Reducer Function for State Management ---
const initialState: State = {
  entities: [],
  listTypes: [],
  isLoading: false,
  isLoadingListTypes: true,
  error: null,
  page: 1,
  pageDocs: [null],
  totalCount: null,
  initialDataLoaded: false,
  allKeysFromType: [],
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'RESET_STATE':
      return {
        ...initialState,
        listTypes: state.listTypes,
        isLoading: !!action.payload.type,
      };
    case 'FETCH_INIT':
      return { ...state, isLoading: true, error: null };
    case 'FETCH_TYPES_SUCCESS':
      return { ...state, listTypes: action.payload, isLoadingListTypes: false };
    case 'FETCH_DATA_SUCCESS':
      // Estimate total count based on whether a full page was returned
      const newTotal = state.page * PAGE_SIZE + (action.payload.hasMore ? 1 : 0);
      return {
        ...state,
        isLoading: false,
        entities: action.payload.entities,
        allKeysFromType: state.allKeysFromType.length === 0 ? action.payload.newKeys : state.allKeysFromType,
        totalCount: state.totalCount === null || newTotal > state.totalCount ? newTotal : state.totalCount,
        initialDataLoaded: true,
      };
    case 'SET_PAGINATION_DOCS':
        const newPageDocs = [...state.pageDocs];
        newPageDocs[action.payload.page] = action.payload.doc;
        return { ...state, pageDocs: newPageDocs };
    case 'FETCH_FAILURE':
      return { ...state, isLoading: false, error: action.payload };
    case 'SET_PAGE':
      return { ...state, page: action.payload };
    default:
      return state;
  }
}

// --- Helper Functions ---

/**
 * Fetches the distinct `type` values from the collection.
 */
async function fetchDistinctTypes(dispatch: Dispatch<Action>) {
    try {
        const q = query(collection(db, 'tsia-complex-entities'), orderBy('type'));
        const snapshot = await getDocs(q);
        const types = new Set<string>();
        snapshot.forEach(doc => {
            const type = doc.data().type;
            if (type) types.add(type);
        });
        dispatch({ type: 'FETCH_TYPES_SUCCESS', payload: Array.from(types).sort() });
    } catch (err) {
        console.error("Failed to fetch list types", err);
        dispatch({ type: 'FETCH_FAILURE', payload: "Αδυναμία φόρτωσης τύπων λίστας." });
    }
}

/**
 * Builds the array of Firestore query constraints based on the current state.
 */
function buildQueryConstraints(
    type: string,
    filters: Record<string, string>,
    pageDocs: (QueryDocumentSnapshot<DocumentData> | null)[],
    page: number,
    direction: 'next' | 'prev' | 'initial'
): QueryConstraint[] {
    const constraints: QueryConstraint[] = [where('type', '==', type)];

    for (const key in filters) {
        if (filters[key]) {
            constraints.push(where(key, '>=', filters[key]), where(key, '<=', filters[key] + '\uf8ff'));
        }
    }
    constraints.push(orderBy('__name__'));

    if (direction === 'next' && pageDocs[page - 1]) {
        constraints.push(startAfter(pageDocs[page - 1]));
    }
    
    constraints.push(limit(PAGE_SIZE));
    return constraints;
}


/**
 * Fetches a single page of entities from Firestore.
 */
async function fetchEntitiesPage(
    dispatch: Dispatch<Action>,
    type: string,
    filters: Record<string, string>,
    pageDocs: (QueryDocumentSnapshot<DocumentData> | null)[],
    page: number,
    direction: 'next' | 'prev' | 'initial'
) {
    dispatch({ type: 'FETCH_INIT' });
    
    try {
        const constraints = buildQueryConstraints(type, filters, pageDocs, page, direction);
        const finalQuery = query(collection(db, 'tsia-complex-entities'), ...constraints);
        const documentSnapshots = await getDocs(finalQuery);

        const newEntities = documentSnapshots.docs.map(doc => ({ id: doc.id, ...doc.data() } as ComplexEntity));
        
        let newKeys: string[] = [];
        if (newEntities.length > 0) {
            newKeys = Object.keys(newEntities[0]);
        } else {
             const keysQuery = query(collection(db, 'tsia-complex-entities'), where('type', '==', type), limit(1));
             const keysSnapshot = await getDocs(keysQuery);
             if(!keysSnapshot.empty) newKeys = Object.keys(keysSnapshot.docs[0].data());
        }

        const lastDoc = documentSnapshots.docs.length > 0 ? documentSnapshots.docs[documentSnapshots.docs.length - 1] : null;
        const hasMore = documentSnapshots.docs.length === PAGE_SIZE;

        dispatch({ type: 'FETCH_DATA_SUCCESS', payload: { entities: newEntities, newKeys, lastDoc, hasMore } });
        dispatch({ type: 'SET_PAGINATION_DOCS', payload: { page: page, doc: lastDoc } });

    } catch (err: any) {
        console.error('Error fetching complex entities:', err);
        dispatch({ type: 'FETCH_FAILURE', payload: 'Αποτυχία φόρτωσης δεδομένων. ' + err.message });
    }
}


// --- Main Hook ---
export function useComplexEntities(type?: string, columnFilters: Record<string, string> = {}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [debouncedFilters] = useDebounce(columnFilters, 500);
  
  useEffect(() => {
    fetchDistinctTypes(dispatch);
  }, []);

  useEffect(() => {
    dispatch({ type: 'RESET_STATE', payload: { type } });
    if (type) {
      fetchEntitiesPage(dispatch, type, debouncedFilters, initialState.pageDocs, 1, 'initial');
    }
  }, [type, debouncedFilters]);
  
  const refetch = useCallback(() => {
    if (type) {
      dispatch({ type: 'RESET_STATE', payload: { type } });
      fetchEntitiesPage(dispatch, type, debouncedFilters, initialState.pageDocs, 1, 'initial');
    }
  }, [type, debouncedFilters]);

  const nextPage = useCallback(() => {
    if (type) {
      const newPage = state.page + 1;
      dispatch({ type: 'SET_PAGE', payload: newPage });
      fetchEntitiesPage(dispatch, type, debouncedFilters, state.pageDocs, newPage, 'next');
    }
  }, [type, debouncedFilters, state.page, state.pageDocs]);

  const prevPage = useCallback(() => {
    refetch();
  }, [refetch]);

  const canGoNext = state.totalCount !== null ? (state.page * PAGE_SIZE) < state.totalCount : false;
  
  return {
    entities: state.entities,
    isLoading: state.isLoading,
    error: state.error,
    listTypes: state.listTypes,
    isLoadingListTypes: state.isLoadingListTypes,
    refetch,
    nextPage,
    prevPage,
    canGoNext,
    canGoPrev: state.page > 1,
    totalCount: state.totalCount,
    page: state.page,
    initialDataLoaded: state.initialDataLoaded,
    allKeysFromType: state.allKeysFromType,
  };
}
