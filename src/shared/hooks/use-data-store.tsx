
'use client';

import { useState, useEffect, createContext, useContext, ReactNode, useCallback } from 'react';
import { collection, onSnapshot, addDoc, serverTimestamp, Timestamp, query as firestoreQuery, getDocs } from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';
import { useAuth } from './use-auth';
import { logActivity } from '@/shared/lib/logger';
import { useQuery } from '@tanstack/react-query';

// --- Interfaces ---
export interface Company {
  id: string;
  name: string;
  logoUrl?: string;
  website?: string;
  contactInfo: {
    email: string;
    phone: string;
    address: string;
    afm: string;
  };
  createdAt: any;
}

export interface Building {
    id: string;
    address: string;
    type: string;
    projectId: string;
    originalId?: string; // Add originalId
}

export interface Project {
  id: string;
  title: string;
  companyId: string;
  location?: string;
  description?: string;
  deadline: Timestamp;
  status: 'Ενεργό' | 'Σε εξέλιξη' | 'Ολοκληρωμένο';
  photoUrl?: string;
  tags?: string[];
  createdAt: any;
}

interface DataStoreContextType {
  companies: Company[];
  projects: Project[];
  buildings: Building[];
  isLoading: boolean;
  addCompany: (companyData: Omit<Company, 'id' | 'createdAt'>) => Promise<string | null>;
  addProject: (projectData: Omit<Project, 'id' | 'createdAt' | 'deadline' | 'tags'> & { deadline: Date, tags?: string }) => Promise<string | null>;
}

const DataStoreContext = createContext<DataStoreContextType>({
  companies: [],
  projects: [],
  buildings: [],
  isLoading: true,
  addCompany: async () => null,
  addProject: async () => null,
});

async function fetchCollectionData<T>(collectionName: string): Promise<T[]> {
    const q = firestoreQuery(collection(db, collectionName));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as T);
}


export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  const { data: companies = [], isLoading: isLoadingCompanies } = useQuery({
      queryKey: ['companies'],
      queryFn: () => fetchCollectionData<Company>('companies'),
      enabled: !!user,
      staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: projects = [], isLoading: isLoadingProjects } = useQuery({
      queryKey: ['projects'],
      queryFn: () => fetchCollectionData<Project>('projects'),
      enabled: !!user,
      staleTime: 5 * 60 * 1000,
  });
  
  const { data: buildings = [], isLoading: isLoadingBuildings } = useQuery({
      queryKey: ['buildings'],
      queryFn: () => fetchCollectionData<Building>('buildings'),
      enabled: !!user,
      staleTime: 5 * 60 * 1000,
  });

  const isLoading = isLoadingCompanies || isLoadingProjects || isLoadingBuildings;

  const addCompany = useCallback(async (companyData: Omit<Company, 'id' | 'createdAt'>): Promise<string | null> => {
    try {
        const docRef = await addDoc(collection(db, 'companies'), {
            ...companyData,
            createdAt: serverTimestamp(),
        });
        await logActivity('CREATE_COMPANY', {
            entityId: docRef.id,
            entityType: 'company',
            name: companyData.name
        });
        return docRef.id;
    } catch(e) {
        console.error("Error adding company:", e);
        return null;
    }
  }, []);
  
  const addProject = useCallback(async (projectData: Omit<Project, 'id' | 'createdAt' | 'deadline' | 'tags'> & { deadline: Date, tags?: string }): Promise<string | null> => {
    try {
        const { tags, ...restOfData } = projectData;
        const finalData = {
            ...restOfData,
            tags: tags ? tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
            deadline: Timestamp.fromDate(projectData.deadline),
            createdAt: serverTimestamp(),
        };

        const docRef = await addDoc(collection(db, 'projects'), finalData);
        await logActivity('CREATE_PROJECT', {
            entityId: docRef.id,
            entityType: 'project',
            name: projectData.title
        });
        return docRef.id;
    } catch(e) {
        console.error("Error adding project:", e);
        return null;
    }
  }, []);


  return (
    <DataStoreContext.Provider value={{ companies, projects, buildings, isLoading, addCompany, addProject }}>
      {children}
    </DataStoreContext.Provider>
  );
}

export const useDataStore = () => {
  const context = useContext(DataStoreContext);
  if (context === undefined) {
    throw new Error('useDataStore must be used within a DataProvider');
  }
  return context;
};
