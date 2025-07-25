
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

export interface Building {
    id: string;
    address: string;
    type: string;
    projectId: string;
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

export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
        setCompanies([]);
        setProjects([]);
        setBuildings([]);
        setIsLoading(false);
        return;
    }

    setIsLoading(true);
    
    const listeners = [
        { name: 'companies', setter: setCompanies },
        { name: 'projects', setter: setProjects },
        { name: 'buildings', setter: setBuildings },
    ];
    
    let loadedCount = 0;
    const checkLoadingDone = () => {
        loadedCount++;
        if (loadedCount === listeners.length) {
            setIsLoading(false);
        }
    };

    const unsubscribers = listeners.map(({ name, setter }) => {
        try {
            const q = collection(db, name);
            return onSnapshot(q, (snapshot) => {
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setter(data as any);
                if (!isLoading) checkLoadingDone();
            }, (error) => {
                console.error(`Failed to fetch ${name}:`, error);
                if (!isLoading) checkLoadingDone(); // Mark as "loaded" even on error to not block the UI
            });
        } catch (error) {
            console.error(`Error setting up listener for ${name}:`, error);
            if (!isLoading) checkLoadingDone();
            return () => {}; // Return an empty unsubscribe function
        }
    });
    
    // Fallback to ensure loading is always eventually set to false
    const loadingTimeout = setTimeout(() => {
        if(isLoading) {
            setIsLoading(false);
        }
    }, 5000); // 5 second timeout


    return () => {
        unsubscribers.forEach(unsub => unsub && unsub());
        clearTimeout(loadingTimeout);
    };
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
