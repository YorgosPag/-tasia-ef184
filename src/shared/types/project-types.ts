

import { z } from 'zod';
import { Timestamp } from 'firebase/firestore';
import type { Project } from '@/shared/hooks/use-data-store';
import { projectSchema } from '@/components/projects/ProjectDialogForm';

export interface ChecklistItem {
    task: string;
    completed: boolean;
    completionDate?: Timestamp;
    completedBy?: string;
    inspectionNotes?: string;
}

export interface WorkStageComment {
    id: string;
    text: string;
    authorId: string;
    authorEmail: string;
    createdAt: Timestamp;
    type: 'internal' | 'client';
}

export interface WorkStagePhoto {
    url: string;
    name: string;
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
    dependsOn?: string[];
    notes?: string;
    checklist?: ChecklistItem[];
    documents?: string[];
    comments?: WorkStageComment[];
    photos?: WorkStagePhoto[];
    budgetedCost?: number;
    actualCost?: number;
    topLevelId: string;
    originalId: string;
}

export interface WorkStageWithSubstages extends WorkStage {
    workSubstages: WorkStage[];
}


export interface ProjectWithWorkStageSummary extends Project {
    workStageSummary?: {
        currentWorkStageName: string;
        progress: number;
        overallStatus: 'Εκκρεμεί' | 'Σε εξέλιξη' | 'Ολοκληρώθηκε' | 'Καθυστερεί';
    }
}

export type ProjectFormValues = z.infer<typeof projectSchema>;
