
import { z } from 'zod';
import type { Project } from '@/hooks/use-data-store';
import { projectSchema } from '@/components/projects/ProjectDialogForm';

export interface ProjectWithWorkStageSummary extends Project {
    workStageSummary?: {
        currentWorkStageName: string;
        progress: number;
        overallStatus: 'Εκκρεμεί' | 'Σε εξέλιξη' | 'Ολοκληρώθηκε' | 'Καθυστερεί';
    }
}

export type ProjectFormValues = z.infer<typeof projectSchema>;
