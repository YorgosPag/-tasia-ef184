
'use client';

import { useState, useEffect, createContext, useContext, ReactNode, useCallback } from 'react';
import { collection, onSnapshot, addDoc, serverTimestamp, Timestamp, getDocs, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './use-auth';
import { useToast } from './use-toast';
import { logActivity } from '@/lib/logger';

/**
 * useDataStore: A custom hook that serves as a central data hub for the application.
 * It provides real-time updates for top-level collections
 * from Firestore. It also exposes memoized
 * functions for adding new documents, abstracting away the direct Firestore calls
 * from the UI components. This hook is designed to be used within the DataProvider.
 */

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
  isLoading: boolean;
  isEditor: boolean;
  addCompany: (companyData: Omit<Company, 'id' | 'createdAt'>) => Promise<string | null>;
  addProject: (projectData: Omit<Project, 'id' | 'createdAt' | 'deadline' | 'tags'> & { deadline: Date, tags?: string }) => Promise<string | null>;
}

const DataStoreContext = createContext<DataStoreContextType>({
  companies: [],
  projects: [],
  isLoading: true,
  isEditor: false,
  addCompany: async () => null,
  addProject: async () => null,
});

export function DataProvider({ children }: { children: ReactNode }) {
  const { user, isEditor } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // This effect now only handles the loading state, data is fetched in pages.
  useEffect(() => {
    if (!user) {
        setIsLoading(false);
        return;
    };
    // The loading state is now managed within each page's data fetching hooks/effects.
    // This provider just gives access to the auth state and add methods.
    setIsLoading(false);
  }, [user]);


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

  const addProject = useCallback(async (projectData: Omit<Project, 'id' | 'createdAt' | 'deadline'| 'tags'> & { deadline: Date, tags?: string }): Promise<string | null> => {
    try {
        const { tags, ...restOfData } = projectData;
        const tagsArray = tags ? tags.split(',').map(tag => tag.trim()).filter(Boolean) : [];
        
        const docRef = await addDoc(collection(db, 'projects'), {
          ...restOfData,
          description: projectData.description || '',
          photoUrl: projectData.photoUrl?.trim() || undefined,
          tags: tagsArray,
          deadline: Timestamp.fromDate(projectData.deadline),
          createdAt: serverTimestamp(),
        });
        return docRef.id;
    } catch (e) {
        console.error("Error adding project:", e);
        return null;
    }
  }, []);


  return (
    <DataStoreContext.Provider value={{ companies, projects, isLoading, isEditor, addCompany, addProject }}>
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
