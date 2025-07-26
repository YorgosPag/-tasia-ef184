
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';
import { ProjectHeader } from '@/tasia/components/projects/ProjectHeader';
import { BuildingsSection } from '@/tasia/components/projects/BuildingsSection';
import { WorkStagesSection } from '@/tasia/components/projects/WorkStagesSection';
import { ContractsSection } from '@/tasia/components/projects/ContractsSection';
import { MaterialsSection } from '@/tasia/components/projects/MaterialsSection';
import { MeetingsSection } from '@/tasia/components/projects/MeetingsSection';
import { ProjectActivityTimeline } from '@/tasia/components/projects/ProjectActivityTimeline';
import { useDataStore } from '@/hooks/use-data-store';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


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
}

export interface Building {
  id: string;
  topLevelId: string;
  address: string;
  type: string;
  description?: string;
  photoUrl?: string;
  createdAt?: any;
}


export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  
  const [project, setProject] = useState<Project | null>(null);
  const [isLoadingProject, setIsLoadingProject] = useState(true);
  
  const { companies, isLoading: isLoadingCompanies } = useDataStore();

  useEffect(() => {
    if (!projectId) return;

    const docRef = doc(db, 'projects', projectId);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setProject({ id: docSnap.id, ...docSnap.data() } as Project);
      } else {
        console.error("No such project!");
        router.push('/projects');
      }
      setIsLoadingProject(false);
    });

    return () => unsubscribe();
  }, [projectId, router]);


  if (isLoadingProject || !project) {
    return <div className="flex justify-center items-center h-full"><Loader2 className="h-16 w-16 animate-spin text-muted-foreground" /></div>;
  }
  
  return (
    <div className="flex flex-col gap-6">
      <ProjectHeader project={project} />
       <Tabs defaultValue="buildings" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="buildings">Κτίρια</TabsTrigger>
                <TabsTrigger value="work-stages">Στάδια Εργασίας</TabsTrigger>
                <TabsTrigger value="contracts">Συμβόλαια</TabsTrigger>
                <TabsTrigger value="materials">Υλικά</TabsTrigger>
                <TabsTrigger value="meetings">Συσκέψεις</TabsTrigger>
                <TabsTrigger value="activity">Ιστορικό</TabsTrigger>
            </TabsList>
            <TabsContent value="buildings" className="mt-4">
              <BuildingsSection project={project} />
            </TabsContent>
            <TabsContent value="work-stages" className="mt-4">
              <WorkStagesSection project={project} companies={companies} isLoadingCompanies={isLoadingCompanies} />
            </TabsContent>
             <TabsContent value="contracts" className="mt-4">
              <ContractsSection project={project} />
            </TabsContent>
            <TabsContent value="materials" className="mt-4">
                <MaterialsSection project={project} />
            </TabsContent>
            <TabsContent value="meetings" className="mt-4">
                <MeetingsSection project={project} />
            </TabsContent>
            <TabsContent value="activity" className="mt-4">
              <ProjectActivityTimeline projectId={project.id} />
            </TabsContent>
        </Tabs>
    </div>
  );
}
