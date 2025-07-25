
'use client';

import { useState, useEffect } from 'react';
import {
  collection,
  onSnapshot,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';

export interface ComplexEntity {
  id: string;
  type: string;
  name: string;
  address?: string;
  phone?: string;
  region?: string;
  email?: string;
  website?: string;
  notes?: string;
  createdAt: any;
}

async function fetchComplexEntities(type: string): Promise<ComplexEntity[]> {
    if (!type) return [];
    
    // Removed orderBy('name') to avoid needing a composite index.
    const q = query(
        collection(db, 'tsia-complex-entities'),
        where('type', '==', type)
    );
    const snapshot = await getDocs(q);
    const entitiesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ComplexEntity));
    // Sort data on the client side
    entitiesData.sort((a, b) => a.name.localeCompare(b.name));
    return entitiesData;
}


export function useComplexEntities(type: string) {
  const { data: entities = [], isLoading } = useQuery({
      queryKey: ['complexEntities', type],
      queryFn: () => fetchComplexEntities(type),
      enabled: !!type,
  });

  // CRUD functions would go here (addEntity, updateEntity, deleteEntity)
  return { entities, isLoading };
}
