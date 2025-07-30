import type { Timestamp } from 'firebase/firestore';

export interface Building {
    id: string;
    address: string;
    type: string;
    projectId: string;
    originalId: string;
    topLevelId: string;
    createdAt: any;
    description?: string;
    photoUrl?: string;
    constructionYear?: number;
}
  
export interface Project {
    id: string;
    title: string;
    companyId: string;
    location?: string;
    description?: string;
    deadline: any;
    status: 'Ενεργό' | 'Σε εξέλιξη' | 'Ολοκληρωμένο';
    photoUrl?: string;
    tags?: string[];
    createdAt: any;
    workStageSummary?: {
        currentWorkStageName?: string;
        progress: number;
        overallStatus: WorkStage['status'];
    };
}
export interface ProjectWithWorkStageSummary extends Project {
    workStageSummary?: {
      currentWorkStageName?: string;
      progress: number;
      overallStatus: WorkStage['status'];
    };
}

export interface WorkStageComment {
  id: string;
  authorId: string;
  authorEmail: string;
  text: string;
  createdAt: Timestamp;
}

export interface ChecklistItem {
    task: string;
    completed: boolean;
    completionDate?: Timestamp;
    completedBy?: string;
    inspectionNotes?: string;
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
    status: 'Εκκρεμεί' | 'Σε εξέλιξη' | 'Ολοκληρωθηκε' | 'Καθυστερεί';
    assignedTo?: string[];
    dependsOn?: string[];
    startDate?: Timestamp;
    endDate?: Timestamp;
    deadline?: Timestamp;
    documents?: string[];
    notes?: string;
    checklist?: ChecklistItem[];
    photos?: Photo[];
    comments?: WorkStageComment[];
    budgetedCost?: number;
    actualCost?: number;
}

export interface WorkStageWithSubstages extends WorkStage {
    workSubstages: WorkStage[];
}

export interface ProjectFormValues {
  id?: string;
  title: string;
  companyId: string;
  location?: string;
  description?: string;
  deadline: Date;
  status: 'Ενεργό' | 'Σε εξέλιξη' | 'Ολοκληρωμένο';
  photoUrl?: string;
  tags?: string;
}
