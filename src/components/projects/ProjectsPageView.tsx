"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Loader2, Download, Search } from "lucide-react";
import { ProjectDialogForm } from "@/components/projects/ProjectDialogForm";
import { Company, useCompanies } from "@/hooks/use-data-store";
import { UseFormReturn } from "react-hook-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  ProjectWithWorkStageSummary,
  ProjectFormValues,
} from "@/lib/types/project-types";
import dynamic from "next/dynamic";
import { ProjectTableSkeleton } from "./ProjectTableSkeleton";

const ProjectTable = dynamic(
  () =>
    import("@/components/projects/ProjectTable").then(
      (mod) => mod.ProjectTable,
    ),
  {
    loading: () => <ProjectTableSkeleton />,
    ssr: false,
  },
);

interface ProjectsPageViewProps {
  filteredProjects: ProjectWithWorkStageSummary[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isLoading: boolean;
  isEditor: boolean;
  isDialogOpen: boolean;
  isSubmitting: boolean;
  editingProject: ProjectWithWorkStageSummary | null;
  form: UseFormReturn<ProjectFormValues>;
  view: string;
  router: any;
  handleExport: () => void;
  handleDialogOpenChange: (open: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  handleEditClick: (project: ProjectWithWorkStageSummary) => void;
  handleDuplicateProject: (projectId: string) => void;
  handleDeleteProject: (projectId: string) => void;
  handlePrefetchProject: (projectId: string) => void;
}

export function ProjectsPageView({
  filteredProjects,
  searchQuery,
  setSearchQuery,
  isLoading,
  isEditor,
  isDialogOpen,
  isSubmitting,
  editingProject,
  form,
  view,
  router,
  handleExport,
  handleDialogOpenChange,
  onSubmit,
  handleEditClick,
  handleDuplicateProject,
  handleDeleteProject,
  handlePrefetchProject,
}: ProjectsPageViewProps) {
  const { companies, isLoading: isLoadingCompanies } = useCompanies();
  const searchParams = useSearchParams();
  const currentView = searchParams.get("view") || "index";

  const handleTabChange = (value: string) => {
    router.push(`/projects?view=${value}`);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Έργα
        </h1>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleExport}
            variant="outline"
            disabled={isLoading || filteredProjects.length === 0}
          >
            <Download className="mr-2" />
            Εξαγωγή σε JSON
          </Button>
          {isEditor && (
            <Button onClick={() => handleDialogOpenChange(true)}>
              <PlusCircle className="mr-2" />
              Νέο Έργο
            </Button>
          )}
        </div>
      </div>

      <Tabs value={currentView} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-2 md:w-1/3">
          <TabsTrigger value="index">Ευρετήριο</TabsTrigger>
          <TabsTrigger value="construction">Κατασκευή</TabsTrigger>
        </TabsList>

        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Αναζήτηση σε τίτλο, τοποθεσία, εταιρεία..."
            className="pl-10 w-full md:w-1/3"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Λίστα Έργων ({filteredProjects.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <ProjectTableSkeleton />
            ) : filteredProjects.length > 0 ? (
              <ProjectTable
                projects={filteredProjects}
                companies={companies}
                isEditor={isEditor}
                onEdit={handleEditClick}
                onDuplicate={handleDuplicateProject}
                onDelete={handleDeleteProject}
                onPrefetch={handlePrefetchProject}
              />
            ) : (
              <p className="text-center text-muted-foreground py-8">
                {searchQuery
                  ? "Δεν βρέθηκαν έργα που να ταιριάζουν με την αναζήτηση."
                  : "Δεν βρέθηκαν έργα."}
              </p>
            )}
          </CardContent>
        </Card>
      </Tabs>

      {isEditor && (
        <ProjectDialogForm
          open={isDialogOpen}
          onOpenChange={handleDialogOpenChange}
          form={form}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          isLoading={isLoadingCompanies}
          editingProject={editingProject}
          companies={companies}
        />
      )}
    </div>
  );
}
