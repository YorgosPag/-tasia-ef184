import { Timestamp } from "firebase/firestore";
import { format } from "date-fns";
import { Company } from "@/hooks/use-data-store";
import type {
  WorkStage,
  WorkStageWithSubstages,
  ChecklistItem,
} from "@/lib/types/project-types";

export const formatDate = (timestamp?: Timestamp | Date) => {
  if (!timestamp) return "-";
  const date = timestamp instanceof Timestamp ? timestamp.toDate() : timestamp;
  return format(date, "dd/MM/yyyy");
};

export const getStatusVariant = (status: WorkStage["status"]) => {
  switch (status) {
    case "Ολοκληρώθηκε":
      return "default";
    case "Σε εξέλιξη":
      return "secondary";
    case "Καθυστερεί":
      return "destructive";
    default:
      return "outline";
  }
};

export const getCompanyNames = (
  companyIds: string[] = [],
  companies: Company[],
) => {
  if (!companyIds || companyIds.length === 0) return "Κανένας";
  return companyIds
    .map((id) => companies.find((c) => c.id === id)?.name || id)
    .join(", ");
};

export const formatCurrency = (value?: number) => {
  if (value === undefined || value === null) return "-";
  return `€${value.toLocaleString("el-GR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const calculateChecklistProgress = (
  checklist?: ChecklistItem[],
): number => {
  if (!checklist || checklist.length === 0) return 0;
  const completedTasks = checklist.filter((item) => item.completed).length;
  return (completedTasks / checklist.length) * 100;
};

export const calculateStageProgress = (
  stage: WorkStageWithSubstages,
): number => {
  const checklistProgress = calculateChecklistProgress(stage.checklist);

  if (stage.workSubstages?.length > 0) {
    const substagesProgressValues = stage.workSubstages.map((ss) =>
      calculateChecklistProgress(ss.checklist),
    );
    const totalSubstageProgress =
      substagesProgressValues.reduce((acc, p) => acc + p, 0) /
      stage.workSubstages.length;
    // Weighted average: 50% for own checklist, 50% for substages
    return checklistProgress * 0.5 + totalSubstageProgress * 0.5;
  }

  return checklistProgress;
};
