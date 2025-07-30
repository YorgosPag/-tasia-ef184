
'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Timestamp, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/shared/hooks/use-toast';
import { useDataStore, Project, Company } from '@/shared/hooks/use-data-store';
import { logActivity } from '@/shared/lib/logger';
import { exportToJson } from '@/shared/lib/exporter';
import { projectSchema } from '@/components/projects/ProjectDialogForm';
import { formatDate } from '@/lib/project-helpers';
import { useAuth } from './use-auth';
import type { ProjectWithWorkStageSummary, ProjectFormValues } from '@/shared/types/project-types';


export function useProjectsPage() {
  const { projects: allProjects, companies, isLoading, addProject } = useDataStore();
  const { isEditor } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectWithWorkStageSummary | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const view = searchParams.get('view') || 'index';

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      id: undefined,
      title: '',
      companyId: '',
      location: '',
      description: '',
      status: 'Ενεργό',
      photoUrl: '',
      tags: '',
    },
  });

  const handleDialogOpenChange = useCallback((open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      form.reset();
      setEditingProject(null);
    }
  }, [form]);

  const handleEditClick = useCallback((project: ProjectWithWorkStageSummary) => {
    setEditingProject(project);
    form.reset({
      ...project,
      tags: project.tags?.join(', ') || '',
      deadline: project.deadline instanceof Timestamp ? project.deadline.toDate() : new Date(project.deadline),
    });
    setIsDialogOpen(true);
  }, [form]);

  const handleDuplicateProject = useCallback(async (projectId: string) => {
    const projectToClone = allProjects.find((p) => p.id === projectId);
    if (!projectToClone) {
      toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Δεν βρέθηκε το έργο προς αντιγραφή.' });
      return;
    }
    try {
      const { id, createdAt, ...clonedData } = projectToClone;
      const workStageSummary = (clonedData as any).workStageSummary; // Exclude summary if it exists
      if (workStageSummary) {
          delete (clonedData as any).workStageSummary;
      }
      
      clonedData.title = `${clonedData.title} (Copy)`;
      const newId = await addProject({
        ...clonedData,
        tags: clonedData.tags?.join(','),
        deadline: clonedData.deadline instanceof Timestamp ? clonedData.deadline.toDate() : new Date(clonedData.deadline),
      });
      toast({ title: 'Επιτυχία', description: `Το έργο '${projectToClone.title}' αντιγράφηκε.` });
      if(newId) {
        await logActivity('DUPLICATE_PROJECT', {
            entityId: newId,
            entityType: 'project',
            sourceEntityId: projectId,
            name: clonedData.title,
        });
      }
    } catch (error) {
      console.error('Error duplicating project:', error);
      toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Η αντιγραφή απέτυχε.' });
    }
  }, [allProjects, toast, addProject]);

  const handleDeleteProject = useCallback(async (projectId: string) => {
    try {
      const projectToDelete = allProjects.find(p => p.id === projectId);
      await deleteDoc(doc(db, 'projects', projectId));
      toast({ title: 'Επιτυχία', description: 'Το έργο διαγράφηκε.' });

      if (projectToDelete) {
        await logActivity('DELETE_PROJECT', {
            entityId: projectId,
            entityType: 'project',
            name: projectToDelete.title,
        });
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Δεν ήταν δυνατή η διαγραφή του έργου.' });
    }
  }, [allProjects, toast]);

  const onSubmit = useCallback(async (data: ProjectFormValues) => {
    setIsSubmitting(true);
    try {
      if (editingProject) {
        const projectRef = doc(db, 'projects', editingProject.id);
        const { id, ...formData } = data;
        const updateData = {
          ...formData,
          photoUrl: formData.photoUrl?.trim() || undefined,
          tags: formData.tags ? formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean) : [],
          deadline: Timestamp.fromDate(formData.deadline),
        };
        await updateDoc(projectRef, updateData);
        toast({ title: 'Επιτυχία', description: 'Το έργο ενημερώθηκε.' });
        await logActivity('UPDATE_PROJECT', {
            entityId: editingProject.id,
            entityType: 'project',
            name: updateData.title,
            changes: updateData,
        });

      } else {
        const newProjectId = await addProject(data);
        toast({ title: 'Επιτυχία', description: 'Το έργο προστέθηκε.' });
        if (newProjectId) {
            await logActivity('CREATE_PROJECT', {
                entityId: newProjectId,
                entityType: 'project',
                name: data.title,
            });
        }
      }
      handleDialogOpenChange(false);
    } catch (error: any) {
      console.error('Error submitting project: ', error);
      toast({
        variant: 'destructive',
        title: 'Σφάλμα',
        description: `Δεν ήταν δυνατή η υποβολή: ${error.message}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [editingProject, toast, addProject, handleDialogOpenChange]);

  const getCompanyName = useCallback((companyId: string) => {
    return companies.find((c) => c.id === companyId)?.name || companyId;
  }, [companies]);

  const filteredProjects = useMemo(() => {
    if (!allProjects) return [];
    const sortedProjects = [...allProjects].sort((a, b) => a.title.localeCompare(b.title));
    return sortedProjects.filter((project) => {
      const query = searchQuery.toLowerCase();
      const companyName = getCompanyName(project.companyId).toLowerCase();
      return (
        project.title.toLowerCase().includes(query) ||
        (project.location && project.location.toLowerCase().includes(query)) ||
        (project.description && project.description.toLowerCase().includes(query)) ||
        companyName.includes(query) ||
        (project.tags && project.tags.some((tag) => tag.toLowerCase().includes(query)))
      );
    });
  }, [allProjects, searchQuery, getCompanyName]);

  const handleExport = useCallback(() => {
    const dataToExport = filteredProjects.map((p) => ({
      ...p,
      companyName: getCompanyName(p.companyId),
      deadline: formatDate(p.deadline as Timestamp),
      createdAt: formatDate(p.createdAt),
    }));
    exportToJson(dataToExport, 'projects');
  }, [filteredProjects, getCompanyName]);

  return {
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
    view,
    router,
    handleExport,
    handleDialogOpenChange,
    onSubmit: form.handleSubmit(onSubmit),
    handleEditClick,
    handleDuplicateProject,
    handleDeleteProject,
  };
}
