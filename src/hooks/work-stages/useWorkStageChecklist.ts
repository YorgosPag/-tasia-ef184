"use client";

import { writeBatch, doc, arrayUnion } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import type {
  WorkStage,
  WorkStageWithSubstages,
  ChecklistItem,
} from "@/lib/types/project-types";
import { Timestamp } from "firebase/firestore";

/**
 * Manages all logic related to a work stage's checklist.
 * @param projectId The ID of the current project.
 * @param workStages The array of all work stages for the project.
 * @param setWorkStages The state setter function to update the work stages UI optimistically.
 */
export function useWorkStageChecklist(
  projectId: string,
  workStages: WorkStageWithSubstages[],
  setWorkStages: React.Dispatch<React.SetStateAction<WorkStageWithSubstages[]>>,
) {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleChecklistItemToggle = async (
    stage: WorkStage,
    itemIndex: number,
    completed: boolean,
    isSubstage: boolean,
  ) => {
    if (!projectId || !user) return;
    const parentId = isSubstage
      ? workStages.find((ws) =>
          ws.workSubstages?.some((ss) => ss.id === stage.id),
        )?.id
      : undefined;
    if (isSubstage && !parentId) return;

    // Optimistic UI Update
    const originalStages = [...workStages];
    const newStages = originalStages.map((ws) => {
      if (!isSubstage && ws.id === stage.id) {
        const newChecklist = [...(ws.checklist || [])];
        newChecklist[itemIndex] = { ...newChecklist[itemIndex], completed };
        return { ...ws, checklist: newChecklist };
      }
      if (isSubstage && ws.id === parentId) {
        return {
          ...ws,
          workSubstages: ws.workSubstages.map((ss) => {
            if (ss.id === stage.id) {
              const newChecklist = [...(ss.checklist || [])];
              newChecklist[itemIndex] = {
                ...newChecklist[itemIndex],
                completed,
              };
              return { ...ss, checklist: newChecklist };
            }
            return ss;
          }),
        };
      }
      return ws;
    });
    setWorkStages(newStages);

    // Perform database update in the background
    try {
      const docRef = parentId
        ? doc(
            db,
            "projects",
            projectId,
            "workStages",
            parentId,
            "workSubstages",
            stage.id,
          )
        : doc(db, "projects", projectId, "workStages", stage.id);
      const newChecklist = [...(stage.checklist || [])];
      const updatedItem: ChecklistItem = {
        ...newChecklist[itemIndex],
        completed,
        completionDate: completed ? Timestamp.now() : undefined,
        completedBy: completed ? user.email || undefined : undefined,
      };
      newChecklist[itemIndex] = updatedItem;
      const batch = writeBatch(db);
      batch.update(docRef, { checklist: newChecklist });
      const topLevelId = (stage as any).topLevelId;
      if (topLevelId) {
        const topLevelRef = parentId
          ? doc(db, "workSubstages", topLevelId)
          : doc(db, "workStages", topLevelId);
        batch.update(topLevelRef, { checklist: newChecklist });
      }
      await batch.commit();
    } catch (error) {
      console.error("Failed to update checklist item:", error);
      // Rollback UI on failure
      setWorkStages(originalStages);
      toast({
        variant: "destructive",
        title: "Σφάλμα",
        description: "Η αλλαγή απέτυχε. Επαναφορά.",
      });
    }
  };

  const handleAddChecklistItem = async (
    stage: WorkStage,
    task: string,
    isSubstage: boolean,
  ) => {
    if (!projectId) return;
    const parentId = isSubstage
      ? workStages.find((ws) =>
          ws.workSubstages?.some((ss) => ss.id === stage.id),
        )?.id
      : undefined;
    if (isSubstage && !parentId) return;
    const docRef = parentId
      ? doc(
          db,
          "projects",
          projectId,
          "workStages",
          parentId,
          "workSubstages",
          stage.id,
        )
      : doc(db, "projects", projectId, "workStages", stage.id);
    const newItem = { task, completed: false };
    const batch = writeBatch(db);
    batch.update(docRef, { checklist: arrayUnion(newItem) });
    const topLevelId = (stage as any).topLevelId;
    if (topLevelId) {
      const topLevelRef = parentId
        ? doc(db, "workSubstages", topLevelId)
        : doc(db, "workStages", topLevelId);
      batch.update(topLevelRef, { checklist: arrayUnion(newItem) });
    }
    await batch.commit();
  };

  const handleInspectionNotesChange = async (
    stage: WorkStage,
    itemIndex: number,
    notes: string,
    isSubstage: boolean,
  ) => {
    if (!projectId) return;
    const parentId = isSubstage
      ? workStages.find((ws) =>
          ws.workSubstages?.some((ss) => ss.id === stage.id),
        )?.id
      : undefined;
    if (isSubstage && !parentId) return;
    const docRef = parentId
      ? doc(
          db,
          "projects",
          projectId,
          "workStages",
          parentId,
          "workSubstages",
          stage.id,
        )
      : doc(db, "projects", projectId, "workStages", stage.id);
    const newChecklist = [...(stage.checklist || [])];
    if (newChecklist[itemIndex])
      newChecklist[itemIndex].inspectionNotes = notes;
    const batch = writeBatch(db);
    batch.update(docRef, { checklist: newChecklist });
    const topLevelId = (stage as any).topLevelId;
    if (topLevelId) {
      const topLevelRef = parentId
        ? doc(db, "workSubstages", topLevelId)
        : doc(db, "workStages", topLevelId);
      batch.update(topLevelRef, { checklist: newChecklist });
    }
    await batch.commit();
    toast({ title: "Οι παρατηρήσεις αποθηκεύτηκαν." });
  };

  return {
    handleChecklistItemToggle,
    handleAddChecklistItem,
    handleInspectionNotesChange,
  };
}
