
'use client';

import { useState, useMemo } from 'react';
import { collectionGroup, query, where, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/use-auth';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { getStatusVariant, formatDate } from '@/components/projects/work-stages/utils';
import { useRouter } from 'next/navigation';

interface WorkStage {
    id: string;
    name: string;
    status: 'Εκκρεμεί' | 'Σε εξέλιξη' | 'Ολοκληρώθηκε' | 'Καθυστερεί';
    deadline?: Timestamp;
    projectId: string;
    parentStageId?: string; // Only for substages
}

async function fetchAssignments(companyId: string): Promise<WorkStage[]> {
    if (!companyId) return [];
    
    const stagesQuery = query(collectionGroup(db, 'workStages'), where('assignedToId', '==', companyId));
    const subStagesQuery = query(collectionGroup(db, 'workSubstages'), where('assignedToId', '==', companyId));

    const [stagesSnapshot, subStagesSnapshot] = await Promise.all([
        getDocs(stagesQuery),
        getDocs(subStagesQuery),
    ]);

    const assignments: WorkStage[] = [];
    stagesSnapshot.forEach(doc => assignments.push({ id: doc.id, ...doc.data() } as WorkStage));
    subStagesSnapshot.forEach(doc => assignments.push({ id: doc.id, ...doc.data() } as WorkStage));
    
    return assignments.sort((a, b) => (a.deadline?.toMillis() || 0) - (b.deadline?.toMillis() || 0));
}

export default function AssignmentsPage() {
    const { user } = useAuth(); // Assuming useAuth provides the user's company ID or similar
    const router = useRouter();
    // This is a placeholder. In a real app, you'd get the companyId from the user's profile.
    // For now, we assume one-to-one mapping of user to a company for simplicity.
    // In a multi-company user scenario, you might have a dropdown to select the company.
    const companyIdForAssignments = user?.uid; 

    const { data: assignments = [], isLoading, isError } = useQuery({
        queryKey: ['assignments', companyIdForAssignments],
        queryFn: () => fetchAssignments(companyIdForAssignments!),
        enabled: !!companyIdForAssignments,
    });
    
    const handleRowClick = (item: WorkStage) => {
        router.push(`/projects/${item.projectId}?view=construction`);
    };

    return (
        <div className="flex flex-col gap-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Οι Αναθέσεις μου
            </h1>

            <Card>
                <CardHeader>
                    <CardTitle>Λίστα Εργασιών ({assignments.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center items-center h-40">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : isError ? (
                        <p className="text-center text-destructive py-8">Σφάλμα κατά τη φόρτωση των αναθέσεων.</p>
                    ) : assignments.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Όνομα Εργασίας</TableHead>
                                    <TableHead>Τύπος</TableHead>
                                    <TableHead>Κατάσταση</TableHead>
                                    <TableHead>Προθεσμία</TableHead>
                                    <TableHead>Project ID</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {assignments.map((item) => (
                                    <TableRow key={item.id} onClick={() => handleRowClick(item)} className="cursor-pointer">
                                        <TableCell className="font-medium">{item.name}</TableCell>
                                        <TableCell>
                                            <Badge variant={item.parentStageId ? 'outline' : 'secondary'}>
                                                {item.parentStageId ? 'Υποστάδιο' : 'Κύριο Στάδιο'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusVariant(item.status)}>{item.status}</Badge>
                                        </TableCell>
                                        <TableCell>{formatDate(item.deadline)}</TableCell>
                                        <TableCell className="font-mono text-xs">{item.projectId}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <p className="text-center text-muted-foreground py-8">
                            Δεν έχετε τρέχουσες αναθέσεις.
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
