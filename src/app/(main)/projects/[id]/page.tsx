"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ProjectHeader } from "@/components/projects/ProjectHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BuildingsSection } from "@/components/projects/BuildingsSection";
import { WorkStagesSection } from "@/components/projects/WorkStagesSection";
import { ProjectActivityTimeline } from "@/components/projects/ProjectActivityTimeline";
import { MeetingsSection } from "@/components/projects/MeetingsSection";
import { ContractsSection } from "@/components/projects/ContractsSection";
import { MaterialsSection } from "@/components/projects/MaterialsSection";
import type { ProjectWithWorkStageSummary as Project } from "@/lib/types/project-types";

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = params.id as string;
  const view = searchParams.get("view") || "work-stages";

  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!projectId) return;
    const docRef = doc(db, "projects", projectId);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setProject({ id: docSnap.id, ...docSnap.data() } as Project);
      } else {
        console.error("Project not found!");
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [projectId]);

  const handleTabChange = (value: string) => {
    router.push(`/projects/${projectId}?view=${value}`);
  };

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!project) {
    return <p className="text-center">Δεν βρέθηκε το έργο.</p>;
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/projects")}
          className="w-fit"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Επιστροφή στη Λίστα
        </Button>
      </div>
      <ProjectHeader project={project} />

      <Tabs value={view} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="work-stages">Στάδια Εργασιών</TabsTrigger>
          <TabsTrigger value="buildings">Κτίρια</TabsTrigger>
          <TabsTrigger value="meetings">Συσκέψεις</TabsTrigger>
          <TabsTrigger value="contracts">Συμβόλαια</TabsTrigger>
          <TabsTrigger value="materials">Υλικά</TabsTrigger>
          <TabsTrigger value="activity">Ιστορικό</TabsTrigger>
        </TabsList>
        <TabsContent value="work-stages" className="mt-4">
          <WorkStagesSection project={project} />
        </TabsContent>
        <TabsContent value="buildings" className="mt-4">
          <BuildingsSection project={project} />
        </TabsContent>
        <TabsContent value="meetings" className="mt-4">
          <MeetingsSection project={project} />
        </TabsContent>
        <TabsContent value="contracts" className="mt-4">
          <ContractsSection project={project} />
        </TabsContent>
        <TabsContent value="materials" className="mt-4">
          <MaterialsSection project={project} />
        </TabsContent>
        <TabsContent value="activity" className="mt-4">
          <ProjectActivityTimeline projectId={project.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
