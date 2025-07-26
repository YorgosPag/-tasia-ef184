import { Timestamp } from 'firebase/firestore';

export interface ChecklistItem {
  task: string;
  completed: boolean;
  completionDate?: Timestamp;
  completedBy?: string;
  inspectionNotes?: string;
}

export interface Inspection {
    id: string;
    date: Timestamp;
    inspector: string;
    text: string;
    status: 'pending' | 'approved' | 'rejected';
}

export interface WorkStageComment {
    id: string;
    text: string;
    authorId: string;
    authorEmail: string;
    createdAt: Timestamp;
    type: 'internal' | 'client';
}

export interface Photo {
  url: string;
  uploadedAt: Timestamp;
  uploadedBy: string;
}

export interface WorkStage {
  id: string;
  name: string;
  description?: string;
  status: 'Εκκρεμεί' | 'Σε εξέλιξη' | 'Ολοκληρώθηκε' | 'Καθυστερεί';
  startDate?: Timestamp;
  endDate?: Timestamp;
  deadline?: Timestamp;
  assignedTo?: string[];
  dependsOn?: string[]; // IDs of other stages/substages
  checklist?: ChecklistItem[];
  documents?: string[];
  inspections?: Inspection[];
  photos?: Photo[];
  comments?: WorkStageComment[];
  budgetedCost?: number;
  actualCost?: number;
  notes?: string;
  createdAt: Timestamp;
}

export interface WorkStageWithSubstages extends WorkStage {
  workSubstages: WorkStage[];
}
