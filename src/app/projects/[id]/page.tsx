
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import {
  doc,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useDataStore } from '@/hooks/use-data-store';
import { ProjectHeader } from '@/components/projects/ProjectHeader';
import { PhasesSection } from '@/components/projects/PhasesSection';
import { BuildingsSection } from '@/components/projects/BuildingsSection';


// --- TYPES ---
export interface Project {
  id: string;
  title: string;
  companyId: string;
  location?: string;
  description?: string;
  deadline: Timestamp;
  status: string;
  photoUrl?: string;
  tags?: string[];
}

export interface Building {
  id: string; // This will be the ID from the subcollection
  address: string;
  type: string;
  photoUrl?: string;
  createdAt: any;
  topLevelId: string; // This will be the ID from the top-level collection
}

export interface Phase {
  id: string;
  name: string;
  description?: string;
  status: 'Εκκρεμεί' | 'Σε εξέλιξη' | 'Ολοκληρώθηκε' | 'Καθυστερεί';
  assignedTo?: string;
  notes?: string;
  startDate?: Timestamp;
  endDate?: Timestamp;
  deadline?: Timestamp;
  documents?: string[];
  createdAt: Timestamp;
}

export interface PhaseWithSubphases extends Phase {
    subphases: Phase[];
}

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const view = searchParams.get('view') || 'index'; // Default to index view

  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [isLoadingProject, setIsLoadingProject] = useState(true);
  const { toast } = useToast();
  const { companies, isLoading: isLoadingCompanies } = useDataStore();


  // --- DATA FETCHING ---
  useEffect(() => {
    if (!projectId) return;
    const docRef = doc(db, 'projects', projectId);
    const unsubscribe = onSnapshot(docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setProject({ id: docSnap.id, ...docSnap.data() } as Project);
        } else {
          toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Το έργο δεν βρέθηκε.' });
          router.push('/projects');
        }
        setIsLoadingProject(false);
      },
      (error) => {
        console.error("Error fetching project:", error);
        toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Δεν ήταν δυνατή η φόρτωση του έργου.' });
        setIsLoadingProject(false);
      }
    );
    return () => unsubscribe();
  }, [projectId, router, toast]);


  if (isLoadingProject || !project) {
    return <div className="flex justify-center items-center h-full"><Loader2 className="h-16 w-16 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="flex flex-col gap-8">
      <Button variant="outline" size="sm" className="w-fit" onClick={() => router.back()}><ArrowLeft className="mr-2 h-4 w-4" />Επιστροφή στα Έργα</Button>

      <ProjectHeader project={project} />
      
      {view === 'construction' ? (
         <PhasesSection 
            project={project}
            companies={companies}
            isLoadingCompanies={isLoadingCompanies}
          />
      ) : (
        <BuildingsSection project={project}/>
      )}
    </div>
  );
}
