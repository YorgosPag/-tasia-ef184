
'use client';

import { useState, useEffect, createContext, useContext, ReactNode, useCallback } from 'react';
import { collection, onSnapshot, addDoc, serverTimestamp, Timestamp, query } from 'firebase/firestore';
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
    phone?: string;
    address?: string;
    afm?: string;
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


export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Wait until the user is authenticated before fetching data
    if (!user) {
      // If there's no user yet, we shouldn't attempt to fetch.
      // We also check if the auth process is still loading.
      // If auth is no longer loading and user is null, we can stop loading data.
      if (!auth.currentUser && !isLoading) {
         setIsLoading(false);
      }
      return;
    }
    
    setIsLoading(true);

    const companiesQuery = query(collection(db, 'companies'));
    const projectsQuery = query(collection(db, 'projects'));
    const buildingsQuery = query(collection(db, 'buildings'));

    const unsubscribeCompanies = onSnapshot(companiesQuery, 
        (snapshot) => setCompanies(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Company))),
        (err) => console.error("Error fetching companies:", err)
    );
    const unsubscribeProjects = onSnapshot(projectsQuery, 
        (snapshot) => {
            setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project)));
            setIsLoading(false); // Consider loading done when main data arrives
        },
        (err) => {
            console.error("Error fetching projects:", err);
            setIsLoading(false);
        }
    );
    const unsubscribeBuildings = onSnapshot(buildingsQuery, 
        (snapshot) => setBuildings(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Building))),
        (err) => console.error("Error fetching buildings:", err)
    );

    return () => {
        unsubscribeCompanies();
        unsubscribeProjects();
        unsubscribeBuildings();
    };

  }, [user, isLoading]); // Add user and isLoading as dependencies
  
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
            name: projectData.title,
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
