
'use client';

import { useState, useEffect, createContext, useContext, ReactNode, useCallback } from 'react';
import { collection, onSnapshot, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './use-auth';
import { logActivity } from '@/lib/logger';

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
  isLoading: boolean;
  addCompany: (companyData: Omit<Company, 'id' | 'createdAt'>) => Promise<string | null>;
  addProject: (projectData: Omit<Project, 'id' | 'createdAt' | 'deadline' | 'tags'> & { deadline: Date, tags?: string }) => Promise<string | null>;
}

const DataStoreContext = createContext<DataStoreContextType>({
  companies: [],
  isLoading: true,
  addCompany: async () => null,
  addProject: async () => null,
});

export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Return early if the user is not authenticated yet.
    if (!user) {
        setCompanies([]); // Clear data on logout
        setIsLoading(false);
        return;
    }

    setIsLoading(true);
    // Set up the Firestore listener for companies.
    // This will only run once when the user logs in.
    const unsubCompanies = onSnapshot(collection(db, 'companies'), (snapshot) => {
        setCompanies(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Company)));
        setIsLoading(false);
    }, (error) => {
        console.error("Failed to fetch companies:", error);
        setIsLoading(false);
    });

    // The cleanup function will be called when the user logs out (and the component unmounts/re-evaluates).
    return () => {
        unsubCompanies();
    };
  }, [user]); // This effect depends only on the user object.


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
    <DataStoreContext.Provider value={{ companies, isLoading, addCompany, addProject }}>
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
