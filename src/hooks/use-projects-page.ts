"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Timestamp,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  collection,
  query,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import {
  useProjects,
  useCompanies,
  useDataActions,
  Company,
  Project,
} from "@/hooks/use-data-store";
import { logActivity } from "@/lib/logger";
import { exportToJson } from "@/lib/exporter";
import { projectSchema } from "@/components/projects/ProjectDialogForm";
import { formatDate } from "@/lib/project-helpers";
import { useAuth } from "./use-auth";
import { useQueryClient } from "@tanstack/react-query";
import type {
  ProjectWithWorkStageSummary,
  ProjectFormValues,
} from "@/lib/types/project-types";

// --- Internal Hooks for Logic Separation ---

// Function to fetch project details, can be used for prefetching
async function fetchProjectDetails(
  projectId: string,
): Promise<ProjectWithWorkStageSummary> {
  if (!projectId) throw new Error("Project ID is required");
  const projectDoc = await getDoc(doc(db, "projects", projectId));
  if (!projectDoc.exists()) throw new Error("Project not found");
  const projectData = {
    id: projectDoc.id,
    ...projectDoc.data(),
  } as ProjectWithWorkStageSummary;
  // In a real scenario, you might also fetch related work stages here
  return projectData;
}

function useProjectActions(
  allProjects: Project[],
  addProject: (projectData: any) => Promise<string | null>,
  getCompanyName: (companyId: string) => string,
  filteredProjects: ProjectWithWorkStageSummary[],
) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handlePrefetchProject = useCallback(
    (projectId: string) => {
      queryClient.prefetchQuery({
        queryKey: ["projectDetails", projectId],
        queryFn: () => fetchProjectDetails(projectId),
        staleTime: 1000 * 60 * 5, // Prefetched data is fresh for 5 minutes
      });
    },
    [queryClient],
  );

  const handleDuplicateProject = useCallback(
    async (projectId: string) => {
      const projectToClone = allProjects.find((p) => p.id === projectId);
      if (!projectToClone) {
        toast({
          variant: "destructive",
          title: "Σφάλμα",
          description: "Δεν βρέθηκε το έργο προς αντιγραφή.",
        });
        return;
      }
      try {
        const { id, createdAt, ...clonedData } = projectToClone;
        const workStageSummary = (clonedData as any).workStageSummary;
        if (workStageSummary) delete (clonedData as any).workStageSummary;

        clonedData.title = `${clonedData.title} (Copy)`;
        const newId = await addProject({
          ...clonedData,
          tags: clonedData.tags?.join(","),
          deadline:
            clonedData.deadline instanceof Timestamp
              ? clonedData.deadline.toDate()
              : clonedData.deadline,
        });
        toast({
          title: "Επιτυχία",
          description: `Το έργο '${projectToClone.title}' αντιγράφηκε.`,
        });
        if (newId) {
          await logActivity("DUPLICATE_PROJECT", {
            entityId: newId,
            entityType: "project",
            sourceEntityId: projectId,
            name: clonedData.title,
          });
        }
      } catch (error) {
        console.error("Error duplicating project:", error);
        toast({
          variant: "destructive",
          title: "Σφάλμα",
          description: "Η αντιγραφή απέτυχε.",
        });
      }
    },
    [allProjects, toast, addProject],
  );

  const handleDeleteProject = useCallback(
    async (projectId: string) => {
      try {
        const projectToDelete = allProjects.find((p) => p.id === projectId);
        await deleteDoc(doc(db, "projects", projectId));
        toast({ title: "Επιτυχία", description: "Το έργο διαγράφηκε." });
        if (projectToDelete) {
          await logActivity("DELETE_PROJECT", {
            entityId: projectId,
            entityType: "project",
            name: projectToDelete.title,
          });
        }
      } catch (error) {
        console.error("Error deleting project:", error);
        toast({
          variant: "destructive",
          title: "Σφάλμα",
          description: "Δεν ήταν δυνατή η διαγραφή του έργου.",
        });
      }
    },
    [allProjects, toast],
  );

  const handleExport = useCallback(() => {
    const dataToExport = filteredProjects.map((p) => ({
      ...p,
      companyName: getCompanyName(p.companyId),
      deadline: formatDate(p.deadline as Timestamp),
      createdAt: formatDate(p.createdAt),
    }));
    exportToJson(dataToExport, "projects");
  }, [filteredProjects, getCompanyName]);

  return {
    handleDuplicateProject,
    handleDeleteProject,
    handleExport,
    handlePrefetchProject,
  };
}

function useFilteredProjects(allProjects: Project[], companies: Company[]) {
  const [searchQuery, setSearchQuery] = useState("");

  const getCompanyName = useCallback(
    (companyId: string) => {
      return companies.find((c) => c.id === companyId)?.name || companyId;
    },
    [companies],
  );

  const filteredProjects = useMemo(() => {
    if (!allProjects) return [];
    const sortedProjects = [...allProjects].sort((a, b) =>
      a.title.localeCompare(b.title),
    );
    return sortedProjects.filter((project) => {
      const query = searchQuery.toLowerCase();
      const companyName = getCompanyName(project.companyId).toLowerCase();
      return (
        project.title.toLowerCase().includes(query) ||
        (project.location && project.location.toLowerCase().includes(query)) ||
        (project.description &&
          project.description.toLowerCase().includes(query)) ||
        companyName.includes(query) ||
        (project.tags &&
          project.tags.some((tag) => tag.toLowerCase().includes(query)))
      );
    });
  }, [allProjects, searchQuery, getCompanyName]);

  return { filteredProjects, searchQuery, setSearchQuery, getCompanyName };
}

// --- Main Hook (Orchestrator) ---

export function useProjectsPage() {
  const { projects: allProjects, isLoading: isLoadingProjects } = useProjects();
  const { companies, isLoading: isLoadingCompanies } = useCompanies();
  const { addProject } = useDataActions();
  const { isEditor } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const view = searchParams.get("view") || "index";

  const [editingProject, setEditingProject] =
    useState<ProjectWithWorkStageSummary | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      id: undefined,
      title: "",
      companyId: "",
      location: "",
      description: "",
      status: "Ενεργό",
      photoUrl: "",
      tags: "",
    },
  });

  const { filteredProjects, searchQuery, setSearchQuery, getCompanyName } =
    useFilteredProjects(allProjects, companies);

  const {
    handleDuplicateProject,
    handleDeleteProject,
    handleExport,
    handlePrefetchProject,
  } = useProjectActions(
    allProjects,
    addProject,
    getCompanyName,
    filteredProjects,
  );

  const handleDialogOpenChange = useCallback(
    (open: boolean) => {
      setIsDialogOpen(open);
      if (!open) {
        form.reset();
        setEditingProject(null);
      }
    },
    [form],
  );

  const handleEditClick = useCallback(
    (project: ProjectWithWorkStageSummary) => {
      setEditingProject(project);
      form.reset({
        ...project,
        tags: project.tags?.join(", ") || "",
        deadline:
          project.deadline instanceof Timestamp
            ? project.deadline.toDate()
            : project.deadline,
      });
      setIsDialogOpen(true);
    },
    [form],
  );

  const onSubmit = useCallback(
    async (data: ProjectFormValues) => {
      setIsSubmitting(true);
      try {
        if (editingProject) {
          const projectRef = doc(db, "projects", editingProject.id);
          const { id, ...formData } = data;
          const updateData = {
            ...formData,
            photoUrl: formData.photoUrl?.trim() || undefined,
            tags: formData.tags
              ? formData.tags
                  .split(",")
                  .map((tag) => tag.trim())
                  .filter(Boolean)
              : [],
            deadline: Timestamp.fromDate(formData.deadline),
          };
          await updateDoc(projectRef, updateData);
          toast({ title: "Επιτυχία", description: "Το έργο ενημερώθηκε." });
          await logActivity("UPDATE_PROJECT", {
            entityId: editingProject.id,
            entityType: "project",
            name: updateData.title,
            changes: updateData,
          });
        } else {
          const newProjectId = await addProject(data);
          toast({ title: "Επιτυχία", description: "Το έργο προστέθηκε." });
          if (newProjectId) {
            await logActivity("CREATE_PROJECT", {
              entityId: newProjectId,
              entityType: "project",
              name: data.title,
            });
          }
        }
        handleDialogOpenChange(false);
      } catch (error: any) {
        console.error("Error submitting project: ", error);
        toast({
          variant: "destructive",
          title: "Σφάλμα",
          description: `Δεν ήταν δυνατή η υποβολή: ${error.message}`,
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [editingProject, toast, addProject, handleDialogOpenChange],
  );

  return {
    filteredProjects,
    searchQuery,
    setSearchQuery,
    isLoading: isLoadingProjects || isLoadingCompanies,
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
    handlePrefetchProject,
  };
}
