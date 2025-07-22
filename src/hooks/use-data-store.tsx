
'use client';

import { useState, useEffect, createContext, useContext, ReactNode, useCallback } from 'react';
import { collection, onSnapshot, addDoc, serverTimestamp, Timestamp, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './use-auth';
import { useToast } from './use-toast';

// --- Interfaces ---
export interface Company {
  id: string;
  name: string;
  logoUrl?: string;
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
  deadline: Timestamp;
  status: string;
  createdAt: any;
}

interface DataStoreContextType {
  companies: Company[];
  projects: Project[];
  isLoading: boolean;
  addCompany: (companyData: Omit<Company, 'id' | 'createdAt'>) => Promise<void>;
  addProject: (projectData: Omit<Project, 'id' | 'createdAt' | 'deadline'> & { deadline: Date }) => Promise<void>;
}

const DataStoreContext = createContext<DataStoreContextType>({
  companies: [],
  projects: [],
  isLoading: true,
  addCompany: async () => {},
  addProject: async () => {},
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
    });

    const unsubProjects = onSnapshot(collection(db, 'projects'), snapshot => {
        setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project)));
    });

    return () => {
        unsubCompanies();
        unsubProjects();
    }
  }, [user]);


  const addCompany = useCallback(async (companyData: Omit<Company, 'id' | 'createdAt'>) => {
    await addDoc(collection(db, 'companies'), {
      ...companyData,
      createdAt: serverTimestamp(),
    });
  }, []);

  const addProject = useCallback(async (projectData: Omit<Project, 'id' | 'createdAt' | 'deadline'> & { deadline: Date }) => {
    await addDoc(collection(db, 'projects'), {
      ...projectData,
      deadline: Timestamp.fromDate(projectData.deadline),
      createdAt: serverTimestamp(),
    });
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
