
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
import { WorkStagesSection } from '@/components/projects/WorkStagesSection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProjectActivityTimeline } from '@/components/projects/ProjectActivityTimeline';


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

export interface ChecklistItem {
    task: string;
    completed: boolean;
    inspectionNotes?: string;
    completionDate?: Timestamp;
    completedBy?: string;
}

export interface Inspection {
  id: string;
  text: string;
  photoUrl?: string;
  status: 'Pending' | 'Pass' | 'Fail';
  createdAt: any;
  authorId: string;
  authorEmail: string;
}

export interface WorkStagePhoto {
  url: string;
  uploadedAt: Timestamp;
  uploadedBy: string;
}

export interface WorkStageComment {
    id: string;
    text: string;
    authorId: string;
    authorEmail: string;
    createdAt: Timestamp;
    type: 'internal' | 'client';
}

export interface WorkStage {
  id: string;
  name: string;
  description?: string;
  status: 'Εκκρεμεί' | 'Σε εξέλιξη' | 'Ολοκληρώθηκε' | 'Καθυστερεί';
  assignedTo?: string[];
  relatedEntityIds?: string[];
  notes?: string;
  startDate?: Timestamp;
  endDate?: Timestamp;
  deadline?: Timestamp;
  documents?: string[];
  dependsOn?: string[];
  createdAt: Timestamp;
  checklist?: ChecklistItem[];
  budgetedCost?: number;
  actualCost?: number;
  photos?: WorkStagePhoto[];
  comments?: WorkStageComment[];
  inspections?: Inspection[];
}

export interface WorkStageWithSubstages extends WorkStage {
    workSubstages: WorkStage[];
}

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const view = searchParams.get('view') || 'index';

  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [isLoadingProject, setIsLoadingProject] = useState(true);
  const { toast } = useToast();
  const { companies, isLoading: isLoadingCompanies } = useDataStore();

  const handleTabChange = (value: string) => {
    router.push(`/projects/${projectId}?view=${value}`);
  }


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
      
      <Tabs defaultValue={view} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="index">Ευρετήριο</TabsTrigger>
          <TabsTrigger value="construction">Κατασκευή</TabsTrigger>
          <TabsTrigger value="history">Ιστορικό</TabsTrigger>
        </TabsList>
        <TabsContent value="index" className="mt-4">
           <BuildingsSection project={project}/>
        </TabsContent>
        <TabsContent value="construction" className="mt-4">
           <WorkStagesSection 
              project={project}
              companies={companies}
              isLoadingCompanies={isLoadingCompanies}
            />
        </TabsContent>
         <TabsContent value="history" className="mt-4">
           <ProjectActivityTimeline projectId={projectId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

    