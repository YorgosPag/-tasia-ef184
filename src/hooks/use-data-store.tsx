
'use client';

import { useState, useEffect, createContext, useContext, ReactNode, useCallback } from 'react';
import { collection, onSnapshot, addDoc, serverTimestamp, Timestamp, getDocs, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './use-auth';
import { useToast } from './use-toast';
import { logActivity } from '@/lib/logger';

/**
 * useDataStore: A custom hook that serves as a central data hub for the application.
 * It fetches, caches, and provides real-time updates for top-level collections
 * like 'companies' and 'projects' from Firestore. It also exposes memoized
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
  addCompany: (companyData: Omit<Company, 'id' | 'createdAt'>) => Promise<string | null>;
  addProject: (projectData: Omit<Project, 'id' | 'createdAt' | 'deadline' | 'tags'> & { deadline: Date, tags?: string }) => Promise<string | null>;
}

const DataStoreContext = createContext<DataStoreContextType>({
  companies: [],
  projects: [],
  isLoading: true,
  addCompany: async () => null,
  addProject: async () => null,
});

export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial data
  useEffect(() => {
    if (!user) {
        setCompanies([]);
        setProjects([]);
        setIsLoading(false);
        return;
    };

    const fetchAllData = async () => {
        setIsLoading(true);
        try {
            const companiesSnapshot = await getDocs(collection(db, 'companies'));
            const companiesData = companiesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Company));
            setCompanies(companiesData);

            const projectsSnapshot = await getDocs(collection(db, 'projects'));
            const projectsData = projectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
            setProjects(projectsData);

        } catch (error) {
            console.error("Failed to fetch initial data:", error);
            toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Δεν ήταν δυνατή η φόρτωση των δεδομένων.' });
        } finally {
            setIsLoading(false);
        }
    };
    fetchAllData();
  }, [user, toast]);
  
  // Real-time listener for updates (optional, can be enabled if needed)
  useEffect(() => {
    if (!user) return;

    const unsubCompanies = onSnapshot(collection(db, 'companies'), snapshot => {
        setCompanies(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Company)));
    }, error => {
      console.error("Company listener error:", error);
    });

    const unsubProjects = onSnapshot(collection(db, 'projects'), snapshot => {
        setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project)));
    }, error => {
      console.error("Project listener error:", error);
    });

    return () => {
        unsubCompanies();
        unsubProjects();
    }
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
    <DataStoreContext.Provider value={{ companies, projects, isLoading, addCompany, addProject }}>
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
