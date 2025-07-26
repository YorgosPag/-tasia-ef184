

import { Timestamp } from 'firebase/firestore';

export interface WorkStageComment {
    id: string;
    text: string;
    authorId: string;
    authorEmail?: string;
    createdAt: Timestamp;
    type: 'internal' | 'client';
}

export interface Photo {
    url: string;
    uploadedAt: Timestamp;
    uploadedBy: string;
}

export interface ChecklistItem {
    task: string;
    completed: boolean;
    completionDate?: Timestamp;
    completedBy?: string;
    inspectionNotes?: string;
}

export interface WorkStage {
  id: string;
  name: string;
  description?: string;
  status: 'Εκκρεμεί' | 'Σε εξέλιξη' | 'Ολοκληρώθηκε' | 'Καθυστερεί';
  startDate?: Timestamp;
  endDate?: Timestamp;
  deadline?: Timestamp;
  budgetedCost?: number;
  actualCost?: number;
  assignedTo?: string[];
  documents?: string[];
  notes?: string;
  checklist?: ChecklistItem[];
  photos?: Photo[];
  comments?: WorkStageComment[];
  dependsOn?: string[];
}

export interface WorkStageWithSubstages extends WorkStage {
    workSubstages: WorkStage[];
}
