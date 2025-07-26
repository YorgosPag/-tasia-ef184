

'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { useDataStore, Company } from '@/shared/hooks/use-data-store';
import { ProjectHeader } from '@/tasia/components/projects/ProjectHeader';
import { BuildingsSection } from '@/tasia/components/projects/BuildingsSection';
import { WorkStagesSection } from '@/tasia/components/projects/WorkStagesSection';
import { ContractsSection } from '@/tasia/components/projects/ContractsSection';
import { MaterialsSection } from '@/tasia/components/projects/MaterialsSection';
import { MeetingsSection } from '@/tasia/components/projects/MeetingsSection';
import { ProjectActivityTimeline } from '@/tasia/components/projects/ProjectActivityTimeline';
import type { WorkStage, ChecklistItem, WorkStageWithSubstages, WorkStageComment } from './types';


// Main type for the project page
export interface Project {
  id: string;
  title: string;
  companyId: string;
  location: string;
  description: string;
  deadline: any;
  status: 'Ενεργό' | 'Σε εξέλιξη' | 'Ολοκληρωμένο';
  photoUrl?: string;
  tags?: string[];
  createdAt: any;
  workStages?: WorkStageWithSubstages[];
}

export type { WorkStage, ChecklistItem, WorkStageWithSubstages, WorkStageComment };

export default function ProjectDetailsPage() {
  const params = useParams();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { companies, isLoading: isLoadingCompanies } = useDataStore();

  useEffect(() => {
    if (!projectId) return;

    const docRef = doc(db, 'projects', projectId);
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setProject({ id: docSnap.id, ...docSnap.data() } as Project);
        } else {
          console.error("No such document!");
        }
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching project:", error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [projectId]);

  if (isLoading || isLoadingCompanies) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-16 w-16 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!project) {
    return <div>Project not found.</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <ProjectHeader project={project} />
      <Tabs defaultValue="buildings">
        <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="buildings">Κτίρια</TabsTrigger>
            <TabsTrigger value="work_stages">Στάδια Εργασίας</TabsTrigger>
            <TabsTrigger value="contracts">Συμβόλαια</TabsTrigger>
            <TabsTrigger value="materials">Υλικά</TabsTrigger>
            <TabsTrigger value="meetings">Συσκέψεις</TabsTrigger>
            <TabsTrigger value="activity">Ιστορικό</TabsTrigger>
        </TabsList>

        <TabsContent value="buildings" className="mt-6">
            <BuildingsSection project={project} />
        </TabsContent>
        <TabsContent value="work_stages" className="mt-6">
            <WorkStagesSection project={project} companies={companies} isLoadingCompanies={isLoadingCompanies} />
        </TabsContent>
        <TabsContent value="contracts" className="mt-6">
            <ContractsSection project={project} />
        </TabsContent>
         <TabsContent value="materials" className="mt-6">
            <MaterialsSection project={project} />
        </TabsContent>
         <TabsContent value="meetings" className="mt-6">
            <MeetingsSection project={project} />
        </TabsContent>
         <TabsContent value="activity" className="mt-6">
            <ProjectActivityTimeline projectId={project.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
