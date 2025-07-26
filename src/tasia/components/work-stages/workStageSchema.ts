import { z } from 'zod';

export const workStageSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, 'Το όνομα είναι υποχρεωτικό.'),
    description: z.string().optional(),
    status: z.enum(['Εκκρεμεί', 'Σε εξέλιξη', 'Ολοκληρώθηκε', 'Καθυστερεί']),
    assignedTo: z.string().optional(),
    relatedEntityIds: z.string().optional(),
    dependsOn: z.string().optional(),
    notes: z.string().optional(),
    startDate: z.date().optional().nullable(),
    endDate: z.date().optional().nullable(),
    deadline: z.date().optional().nullable(),
    documents: z.string().optional(), 
    budgetedCost: z.string().optional(),
    actualCost: z.string().optional(),
});

export type WorkStageFormValues = z.infer<typeof workStageSchema>;
