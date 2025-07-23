'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Loader2, Download, Search } from 'lucide-react';
import { ProjectTable } from './ProjectTable';
import { ProjectDialogForm, ProjectFormValues } from './ProjectDialogForm';
import { Company, Project } from '@/hooks/use-data-store';
import { UseFormReturn } from 'react-hook-form';

interface ProjectsPageViewProps {
  filteredProjects: Project[];
  companies: Company[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isLoading: boolean;
  isEditor: boolean;
  isDialogOpen: boolean;
  isSubmitting: boolean;
  editingProject: Project | null;
  form: UseFormReturn<ProjectFormValues>;
  handleExport: () => void;
  handleDialogOpenChange: (open: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  handleEditClick: (project: Project) => void;
  handleDuplicateProject: (projectId: string) => void;
  handleDeleteProject: (projectId: string) => void;
}

export function ProjectsPageView({
  filteredProjects,
  companies,
  searchQuery,
  setSearchQuery,
  isLoading,
  isEditor,
  isDialogOpen,
  isSubmitting,
  editingProject,
  form,
  handleExport,
  handleDialogOpenChange,
  onSubmit,
  handleEditClick,
  handleDuplicateProject,
  handleDeleteProject,
}: ProjectsPageViewProps) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Έργα</h1>
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
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Αναζήτηση σε τίτλο, τοποθεσία, εταιρεία..."
          className="pl-10 w-full md:w-1/3"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Λίστα Έργων ({filteredProjects.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredProjects.length > 0 ? (
            <ProjectTable
              projects={filteredProjects}
              companies={companies}
              isEditor={isEditor}
              onEdit={handleEditClick}
              onDuplicate={handleDuplicateProject}
              onDelete={handleDeleteProject}
            />
          ) : (
            <p className="text-center text-muted-foreground py-8">
              {searchQuery ? 'Δεν βρέθηκαν έργα που να ταιριάζουν με την αναζήτηση.' : 'Δεν βρέθηκαν έργα.'}
            </p>
          )}
        </CardContent>
      </Card>

      {isEditor && (
        <ProjectDialogForm
          open={isDialogOpen}
          onOpenChange={handleDialogOpenChange}
          form={form}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          isLoading={isLoading}
          editingProject={editingProject}
          companies={companies}
        />
      )}
    </div>
  );
}
