"use client";

import { useCallback } from "react";
import { doc, writeBatch, getDocs, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { logActivity } from "@/lib/logger";
import { exportToJson } from "@/lib/exporter";
import { formatDate } from "@/components/projects/work-stages/utils";
import type {
  WorkStage,
  WorkStageWithSubstages,
} from "@/lib/types/project-types";

/**
 * Handles actions related to work stages like deletion and export.
 * @param projectId The ID of the current project.
 * @param projectTitle The title of the project, used for exports.
 * @param workStages The array of work stages.
 */
export function useWorkStageActions(
  projectId: string,
  projectTitle: string,
  workStages: WorkStageWithSubstages[],
) {
  const { toast } = useToast();

  const handleDeleteWorkStage = async (
    workStage: WorkStage,
    parentId?: string,
  ) => {
    if (!projectId) return;
    const batch = writeBatch(db);
    try {
      if (parentId) {
        const subStageSubRef = doc(
          db,
          "projects",
          projectId,
          "workStages",
          parentId,
          "workSubstages",
          workStage.id,
        );
        const subStageTopRef = doc(
          db,
          "workSubstages",
          (workStage as any).topLevelId,
        );
        batch.delete(subStageSubRef);
        batch.delete(subStageTopRef);
      } else {
        const mainStageSubRef = doc(
          db,
          "projects",
          projectId,
          "workStages",
          workStage.id,
        );
        const mainStageTopRef = doc(
          db,
          "workStages",
          (workStage as any).topLevelId,
        );
        batch.delete(mainStageSubRef);
        batch.delete(mainStageTopRef);
        const subStagesSnapshot = await getDocs(
          collection(mainStageSubRef, "workSubstages"),
        );
        for (const subDoc of subStagesSnapshot.docs) {
          batch.delete(subDoc.ref);
          const topLevelId = subDoc.data().topLevelId;
          if (topLevelId) batch.delete(doc(db, "workSubstages", topLevelId));
        }
      }
      await batch.commit();
      toast({
        title: "Επιτυχία",
        description: "Το Στάδιο Εργασίας διαγράφηκε.",
      });
      await logActivity(
        parentId ? "DELETE_WORK_SUBSTAGE" : "DELETE_WORK_STAGE",
        {
          entityId: workStage.id,
          entityType: parentId ? "workSubstage" : "workStage",
          details: { name: workStage.name, parentId: parentId },
          projectId: projectId,
        },
      );
    } catch (error) {
      console.error("Error deleting work stage/substage:", error);
      toast({
        variant: "destructive",
        title: "Σφάλμα",
        description: "Η διαγραφή απέτυχε.",
      });
    }
  };

  const handleExport = useCallback(() => {
    const flatData = workStages.flatMap((stage) => {
      const baseStage = {
        level: "Στάδιο Εργασίας",
        name: stage.name,
        status: stage.status,
        startDate: formatDate(stage.startDate),
        endDate: formatDate(stage.endDate),
        deadline: formatDate(stage.deadline),
        budgetedCost: stage.budgetedCost,
        actualCost: stage.actualCost,
      };
      if (!stage.workSubstages || stage.workSubstages.length === 0)
        return [baseStage];
      const substages = stage.workSubstages.map((substage) => ({
        level: "Υποστάδιο Εργασίας",
        name: `${stage.name} > ${substage.name}`,
        status: substage.status,
        startDate: formatDate(substage.startDate),
        endDate: formatDate(substage.endDate),
        deadline: formatDate(substage.deadline),
        budgetedCost: substage.budgetedCost,
        actualCost: substage.actualCost,
      }));
      return [baseStage, ...substages];
    });
    const fileName = `report-${projectTitle.toLowerCase().replace(/\s+/g, "-")}`;
    exportToJson(flatData, fileName);
  }, [workStages, projectTitle]);

  return { handleDeleteWorkStage, handleExport };
}
