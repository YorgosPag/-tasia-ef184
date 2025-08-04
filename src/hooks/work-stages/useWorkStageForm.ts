"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  doc,
  collection,
  writeBatch,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import {
  WorkStageFormValues,
  workStageSchema,
} from "@/components/projects/work-stages/workStageSchema";
import type { WorkStage } from "@/lib/types/project-types";

/**
 * Manages the form state and submission logic for creating and editing work stages.
 * @param projectId The ID of the current project.
 */
export function useWorkStageForm(projectId: string) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingWorkStage, setEditingWorkStage] = useState<
    WorkStage | { parentId: string } | null
  >(null);
  const { toast } = useToast();

  const form = useForm<WorkStageFormValues>({
    resolver: zodResolver(workStageSchema),
    defaultValues: {
      id: undefined,
      name: "",
      status: "Εκκρεμεί",
      assignedTo: "",
      notes: "",
      startDate: null,
      endDate: null,
      deadline: null,
      documents: "",
      description: "",
      relatedEntityIds: "",
      dependsOn: "",
      budgetedCost: "",
      actualCost: "",
    },
  });

  const handleEditWorkStage = (workStage: WorkStage, parentId?: string) => {
    setEditingWorkStage(
      parentId ? ({ ...workStage, parentId } as any) : workStage,
    );
    form.reset({
      ...workStage,
      description: workStage.description || "",
      notes: workStage.notes || "",
      assignedTo: workStage.assignedTo?.[0] || "",
      documents: workStage.documents?.join("\\n") || "",
      relatedEntityIds: (workStage as any).relatedEntityIds?.join(", ") || "",
      dependsOn: workStage.dependsOn?.join(", ") || "",
      startDate: workStage.startDate?.toDate() || null,
      endDate: workStage.endDate?.toDate() || null,
      deadline: workStage.deadline?.toDate() || null,
      budgetedCost: workStage.budgetedCost?.toString() || "",
      actualCost: workStage.actualCost?.toString() || "",
    });
  };

  const handleAddWorkSubstage = (parentId: string) => {
    setEditingWorkStage({ parentId });
    form.reset({
      status: "Εκκρεμεί",
      name: "",
      description: "",
      notes: "",
      documents: "",
      assignedTo: "",
    });
  };

  const onSubmitWorkStage = async (data: WorkStageFormValues) => {
    if (!projectId) return;
    setIsSubmitting(true);
    const batch = writeBatch(db);

    const rawData: any = {
      name: data.name,
      description: data.description || "",
      status: data.status,
      assignedTo: data.assignedTo ? [data.assignedTo] : [],
      relatedEntityIds: data.relatedEntityIds
        ? data.relatedEntityIds
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      dependsOn: data.dependsOn
        ? data.dependsOn
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      notes: data.notes || "",
      startDate: data.startDate,
      endDate: data.endDate,
      deadline: data.deadline,
      documents: data.documents
        ? data.documents
            .split("\\n")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      budgetedCost: data.budgetedCost
        ? parseFloat(data.budgetedCost)
        : undefined,
      actualCost: data.actualCost ? parseFloat(data.actualCost) : undefined,
    };

    const finalData: { [k: string]: any } = Object.fromEntries(
      Object.entries(rawData).filter(
        ([_, v]) => v !== undefined && v !== null && v !== "",
      ),
    );

    if (finalData.startDate)
      finalData.startDate = Timestamp.fromDate(finalData.startDate as Date);
    if (finalData.endDate)
      finalData.endDate = Timestamp.fromDate(finalData.endDate as Date);
    if (finalData.deadline)
      finalData.deadline = Timestamp.fromDate(finalData.deadline as Date);

    if (finalData.documents && Array.isArray(finalData.documents)) {
      const documentTasks = finalData.documents.map((docName: string) => ({
        task: docName,
        completed: false,
      }));
      const existingChecklist =
        editingWorkStage && "checklist" in editingWorkStage
          ? editingWorkStage.checklist || []
          : [];
      const nonDocumentTasks =
        existingChecklist?.filter((item) => !item.task.startsWith("Doc:")) || [];
      finalData.checklist = [...nonDocumentTasks, ...documentTasks];
    }

    try {
      const isSubstage = editingWorkStage && "parentId" in editingWorkStage;
      const isEditing = editingWorkStage && "id" in editingWorkStage;

      if (isEditing) {
        const parentId = (editingWorkStage as any).parentId;
        const workStageId = (editingWorkStage as WorkStage).id;
        const topLevelId = (editingWorkStage as any).topLevelId;
        if (!topLevelId) throw new Error("topLevelId is missing for editing.");
        const topLevelRef = parentId
          ? doc(db, "workSubstages", topLevelId)
          : doc(db, "workStages", topLevelId);
        const subRef = parentId
          ? doc(
              db,
              "projects",
              projectId,
              "workStages",
              parentId,
              "workSubstages",
              workStageId,
            )
          : doc(db, "projects", projectId, "workStages", workStageId);
        batch.update(topLevelRef, {
          ...finalData,
          assignedToId: finalData.assignedTo?.[0] || null,
        });
        batch.update(subRef, finalData as any);
        toast({
          title: "Επιτυχία",
          description: "Το Στάδιο Εργασίας ενημερώθηκε.",
        });
      } else {
        const parentId = isSubstage
          ? (editingWorkStage as { parentId: string }).parentId
          : null;
        if (isSubstage && !parentId)
          throw new Error("Parent ID is missing for substage creation.");
        const topLevelRef = parentId
          ? doc(collection(db, "workSubstages"))
          : doc(collection(db, "workStages"));
        const subRef = doc(
          collection(
            db,
            "projects",
            projectId,
            parentId ? `workStages/${parentId}/workSubstages` : "workStages",
          ),
        );
        batch.set(subRef, {
          ...finalData,
          createdAt: serverTimestamp(),
          inspections: [],
          photos: [],
          comments: [],
          topLevelId: topLevelRef.id,
        });
        batch.set(topLevelRef, {
          ...finalData,
          projectId,
          parentStageId: parentId,
          assignedToId: finalData.assignedTo?.[0] || null,
          createdAt: serverTimestamp(),
          originalId: subRef.id,
        });
        toast({
          title: "Επιτυχία",
          description: `Το ${isSubstage ? "υποστάδιο" : "στάδιο"} προστέθηκε.`,
        });
      }
      await batch.commit();
      setEditingWorkStage(null);
      form.reset();
    } catch (error) {
      console.error("Error submitting work stage/substage:", error);
      toast({
        variant: "destructive",
        title: "Σφάλμα",
        description: "Η υποβολή απέτυχε.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    editingWorkStage,
    setEditingWorkStage,
    handleEditWorkStage,
    handleAddWorkSubstage,
    onSubmitWorkStage,
  };
}
