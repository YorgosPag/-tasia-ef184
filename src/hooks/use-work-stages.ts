"use client";

import { useWorkStageData } from "./work-stages/useWorkStageData";
import { useWorkStageForm } from "./work-stages/useWorkStageForm";
import { useWorkStageActions } from "./work-stages/useWorkStageActions";
import { useWorkStageChecklist } from "./work-stages/useWorkStageChecklist";
import { useWorkStageExtras } from "./work-stages/useWorkStageExtras";

/**
 * Orchestrator Hook for Work Stages feature.
 *
 * This hook composes multiple smaller, focused hooks to provide a complete
 * set of functionalities for managing work stages and substages within a project.
 * It separates concerns such as data fetching, form management, user actions,
 * checklist logic, and extra features like photo uploads and comments.
 *
 * @param {string} projectId - The ID of the project whose work stages are being managed.
 * @param {string} projectTitle - The title of the project, used for exports.
 * @returns An object containing all the state and handlers needed by the UI components.
 */
export function useWorkStages(projectId: string, projectTitle: string) {
  const { workStages, setWorkStages, isLoadingWorkStages } =
    useWorkStageData(projectId);

  const {
    form,
    isSubmitting,
    editingWorkStage,
    setEditingWorkStage,
    handleEditWorkStage,
    handleAddWorkSubstage,
    onSubmitWorkStage,
  } = useWorkStageForm(projectId);

  const { handleDeleteWorkStage, handleExport } = useWorkStageActions(
    projectId,
    projectTitle,
    workStages,
  );

  const {
    handleChecklistItemToggle,
    handleAddChecklistItem,
    handleInspectionNotesChange,
  } = useWorkStageChecklist(projectId, workStages, setWorkStages);

  const { handlePhotoUpload, handleCommentSubmit } = useWorkStageExtras(
    projectId,
    workStages,
  );

  return {
    workStages,
    isLoadingWorkStages,
    isSubmitting,
    form,
    editingWorkStage,
    setEditingWorkStage,
    handleEditWorkStage,
    handleAddWorkSubstage,
    handleDeleteWorkStage,
    onSubmitWorkStage,
    handleChecklistItemToggle,
    handleAddChecklistItem,
    handleInspectionNotesChange,
    handlePhotoUpload,
    handleCommentSubmit,
    handleExport,
  };
}
