
'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Timestamp, doc, updateDoc, deleteDoc, onSnapshot, collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { useDataStore, Project, Company } from '@/hooks/use-data-store';
import { logActivity } from '@/lib/logger';
import { exportToJson } from '@/lib/exporter';
import { ProjectFormValues, projectSchema } from '@/components/projects/ProjectDialogForm';
import { formatDate } from '@/lib/project-helpers';
import { useAuth } from './use-auth';
import type { WorkStage, WorkStageWithSubstages } from '@/app/projects/[id]/page';


export interface ProjectWithWorkStageSummary extends Project {
    workStageSummary?: {
        currentWorkStageName: string;
        overallStatus: 'Σε εξέλιξη' | 'Ολοκληρώθηκε' | 'Εκκρεμεί' | 'Καθυστερεί';
        progress: number;
    }
}


export function useProjectsPage() {
  const [projects, setProjects] = useState<ProjectWithWorkStageSummary[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const { user, isEditor, isLoading: isAuthLoading } = useAuth();
  const { addProject } = useDataStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();
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

  useEffect(() => {
    if (isAuthLoading || !user) {
        setIsLoading(false);
        setProjects([]);
        setCompanies([]);
        return;
    }

    const projectsQuery = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
    const unsubProjects = onSnapshot(projectsQuery, async (snapshot) => {
        setIsLoading(true);
        const projectsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
        
        // Fetch workStage summaries for all projects
        const projectsWithSummaries = await Promise.all(projectsData.map(async (project) => {
            const workStagesQuery = query(collection(db, 'projects', project.id, 'workStages'), orderBy('createdAt', 'asc'));
            const workStagesSnapshot = await getDocs(workStagesQuery);
            const workStages = workStagesSnapshot.docs.map(doc => doc.data() as WorkStage);
            
            if (workStages.length === 0) {
                return { ...project, workStageSummary: undefined };
            }
            
            const completedWorkStages = workStages.filter(p => p.status === 'Ολοκληρώθηκε').length;
            const inProgressWorkStage = workStages.find(p => p.status === 'Σε εξέλιξη');
            const delayedWorkStage = workStages.find(p => p.status === 'Καθυστερεί');

            let overallStatus: ProjectWithWorkStageSummary['workStageSummary']['overallStatus'] = 'Εκκρεμεί';
            let currentWorkStageName = "Έναρξη έργου";
            
            if (delayedWorkStage) {
                overallStatus = 'Καθυστερεί';
                currentWorkStageName = delayedWorkStage.name;
            } else if (inProgressWorkStage) {
                overallStatus = 'Σε εξέλιξη';
                currentWorkStageName = inProgressWorkStage.name;
            } else if (completedWorkStages === workStages.length) {
                overallStatus = 'Ολοκληρώθηκε';
                currentWorkStageName = "Ολοκληρώθηκε";
            } else if (workStages.length > 0) {
                // If no workStage is in progress/delayed but not all are complete, it's pending the next workStage.
                const lastCompletedIndex = workStages.map(p => p.status).lastIndexOf('Ολοκληρώθηκε');
                currentWorkStageName = workStages[lastCompletedIndex + 1]?.name || "Επόμενο στάδιο";
            }

            const progress = workStages.length > 0 ? (completedWorkStages / workStages.length) * 100 : 0;
            
            return {
                ...project,
                workStageSummary: { currentWorkStageName, overallStatus, progress }
            };
        }));
        
        setProjects(projectsWithSummaries);
        setIsLoading(false);
    }, (error) => {
        console.error("Failed to fetch projects:", error);
        setIsLoading(false);
    });

    const unsubCompanies = onSnapshot(collection(db, 'companies'), (snapshot) => {
      setCompanies(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Company)));
    });

    return () => {
      unsubProjects();
      unsubCompanies();
    };
}, [user, isAuthLoading]);


  const handleDialogOpenChange = useCallback((open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      form.reset();
      setEditingProject(null);
    }
  }, [form]);

  const handleEditClick = useCallback((project: Project) => {
    setEditingProject(project);
    form.reset({
      ...project,
      tags: project.tags?.join(', ') || '',
      deadline: project.deadline instanceof Timestamp ? project.deadline.toDate() : project.deadline,
    });
    setIsDialogOpen(true);
  }, [form]);

  const handleDuplicateProject = useCallback(async (projectId: string) => {
    const projectToClone = projects.find((p) => p.id === projectId);
    if (!projectToClone) {
      toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Δεν βρέθηκε το έργο προς αντιγραφή.' });
      return;
    }
    try {
      const { id, createdAt, workStageSummary, ...clonedData } = projectToClone;
      clonedData.title = `${clonedData.title} (Copy)`;
      const newId = await addProject({
        ...clonedData,
        tags: clonedData.tags?.join(','),
        deadline: clonedData.deadline instanceof Timestamp ? clonedData.deadline.toDate() : clonedData.deadline,
      });
      toast({ title: 'Επιτυχία', description: `Το έργο '${projectToClone.title}' αντιγράφηκε.` });
      if (newId) {
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
  }, [projects, toast, addProject]);

  const handleDeleteProject = useCallback(async (projectId: string) => {
    try {
      const projectToDelete = projects.find((p) => p.id === projectId);
      await deleteDoc(doc(db, 'projects', projectId));
      toast({ title: 'Επιτυχία', description: 'Το έργο διαγράφηκε.' });

      if (projectToDelete) {
        await logActivity('DELETE_PROJECT', {
          entityId: projectId,
          entityType: 'project',
          title: projectToDelete.title,
        });
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Δεν ήταν δυνατή η διαγραφή του έργου.' });
    }
  }, [projects, toast]);

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
          title: updateData.title,
          changes: updateData,
        });
      } else {
        const newProjectId = await addProject(data);
        toast({ title: 'Επιτυχία', description: 'Το έργο προστέθηκε.' });
        if (newProjectId) {
          await logActivity('CREATE_PROJECT', {
            entityId: newProjectId,
            entityType: 'project',
            title: data.title,
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
    if (!projects) return [];

    let viewFilteredProjects = projects;

    if (view === 'construction') {
        // Show all projects
    } else { // Default to 'index' view
      // No filter needed, status is now dynamic
    }

    return viewFilteredProjects.filter((project) => {
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
  }, [projects, searchQuery, getCompanyName, view]);

  const handleExport = useCallback(() => {
    const dataToExport = filteredProjects.map((p) => ({
      ...p,
      companyName: getCompanyName(p.companyId),
      deadline: formatDate(p.deadline),
      createdAt: formatDate(p.createdAt),
    }));
    exportToJson(dataToExport, 'projects');
  }, [filteredProjects, getCompanyName]);

  return {
    filteredProjects,
    companies,
    searchQuery,
    setSearchQuery,
    isLoading: isLoading || isAuthLoading,
    isEditor,
    isDialogOpen,
    isSubmitting,
    editingProject,
    form,
    router,
    view,
    handleExport,
    handleDialogOpenChange,
    onSubmit: form.handleSubmit(onSubmit),
    handleEditClick,
    handleDuplicateProject,
    handleDeleteProject,
  };
}
