
'use client';

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, GitMerge } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';
import { format } from 'date-fns';
import { Company } from '@/hooks/use-data-store';
import type { WorkStage, WorkStageWithSubstages } from '@/app/projects/[id]/page';

interface WorkStageTableProps {
    workStages: WorkStageWithSubstages[];
    companies: Company[];
    onAddWorkSubstage: (parentId: string) => void;
    onEditWorkStage: (workStage: WorkStage, parentId?: string) => void;
    onDeleteWorkStage: (workStage: WorkStage, parentId?: string) => void;
}

const formatDate = (timestamp?: Timestamp | Date) => {
    if (!timestamp) return '-';
    const date = timestamp instanceof Timestamp ? timestamp.toDate() : timestamp;
    return format(date, 'dd/MM/yyyy');
};
  
const getStatusVariant = (status: WorkStage['status']) => {
    switch (status) {
        case 'Ολοκληρώθηκε': return 'default';
        case 'Σε εξέλιξη': return 'secondary';
        case 'Καθυστερεί': return 'destructive';
        default: return 'outline';
    }
};

const getCompanyNames = (companyIds: string[] = [], companies: Company[]) => {
    if (!companyIds || companyIds.length === 0) return '-';
    return companyIds.map(id => companies.find(c => c.id === id)?.name || id).join(', ');
};

export function WorkStageTable({
    workStages,
    companies,
    onAddWorkSubstage,
    onEditWorkStage,
    onDeleteWorkStage,
}: WorkStageTableProps) {
    return (
        <div className="w-full overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Στάδιο / Υποστάδιο Εργασίας</TableHead>
                        <TableHead>Κατάσταση</TableHead>
                        <TableHead>Υπεύθυνος</TableHead>
                        <TableHead>Έναρξη</TableHead>
                        <TableHead>Λήξη</TableHead>
                        <TableHead>Προθεσμία</TableHead>
                        <TableHead className="text-right">Ενέργειες</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {workStages.map(workStage => (
                        <React.Fragment key={workStage.id}>
                        <TableRow className="group bg-muted/20">
                            <TableCell className="font-bold">{workStage.name}</TableCell>
                            <TableCell><Badge variant={getStatusVariant(workStage.status)}>{workStage.status}</Badge></TableCell>
                            <TableCell>{getCompanyNames(workStage.assignedTo, companies)}</TableCell>
                            <TableCell>{formatDate(workStage.startDate)}</TableCell>
                            <TableCell>{formatDate(workStage.endDate)}</TableCell>
                            <TableCell>{formatDate(workStage.deadline)}</TableCell>
                            <TableCell className="text-right">
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-end gap-1">
                                    <Button variant="ghost" size="icon" title="Προσθήκη Υποσταδίου" onClick={() => onAddWorkSubstage(workStage.id)}><GitMerge className="h-4 w-4" /><span className="sr-only">Προσθήκη Υποσταδίου</span></Button>
                                    <Button variant="ghost" size="icon" title="Επεξεργασία Σταδίου" onClick={() => onEditWorkStage(workStage)}><Edit className="h-4 w-4"/><span className="sr-only">Επεξεργασία Σταδίου</span></Button>
                                    <AlertDialog><AlertDialogTrigger asChild><Button variant="ghost" size="icon" title="Διαγραφή Σταδίου" className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4"/><span className="sr-only">Διαγραφή Σταδίου</span></Button></AlertDialogTrigger>
                                        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Είστε σίγουροι;</AlertDialogTitle><AlertDialogDescription>Αυτή η ενέργεια θα διαγράψει οριστικά το στάδιο "{workStage.name}" και όλες τις υποφάσεις του.</AlertDialogDescription></AlertDialogHeader>
                                            <AlertDialogFooter><AlertDialogCancel>Ακύρωση</AlertDialogCancel><AlertDialogAction onClick={() => onDeleteWorkStage(workStage)} className="bg-destructive hover:bg-destructive/90">Διαγραφή</AlertDialogAction></AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </TableCell>
                        </TableRow>
                        {workStage.workSubstages.map(substage => (
                            <TableRow key={substage.id} className="group">
                                <TableCell className="pl-8 text-muted-foreground"><span className="mr-2">└</span> {substage.name}</TableCell>
                                <TableCell><Badge variant={getStatusVariant(substage.status)}>{substage.status}</Badge></TableCell>
                                <TableCell>{getCompanyNames(substage.assignedTo, companies)}</TableCell>
                                <TableCell>{formatDate(substage.startDate)}</TableCell>
                                <TableCell>{formatDate(substage.endDate)}</TableCell>
                                <TableCell>{formatDate(substage.deadline)}</TableCell>
                                <TableCell className="text-right">
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-end gap-2">
                                        <Button variant="ghost" size="icon" title="Επεξεργασία Υποσταδίου" onClick={() => onEditWorkStage(substage, workStage.id)}><Edit className="h-4 w-4"/><span className="sr-only">Επεξεργασία Υποσταδίου</span></Button>
                                        <AlertDialog><AlertDialogTrigger asChild><Button variant="ghost" size="icon" title="Διαγραφή Υποσταδίου" className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4"/><span className="sr-only">Διαγραφή Υποσταδίου</span></Button></AlertDialogTrigger>
                                            <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Είστε σίγουροι;</AlertDialogTitle><AlertDialogDescription>Αυτή η ενέργεια θα διαγράψει οριστικά το υποστάδιο "{substage.name}".</AlertDialogDescription></AlertDialogHeader>
                                                <AlertDialogFooter><AlertDialogCancel>Ακύρωση</AlertDialogCancel><AlertDialogAction onClick={() => onDeleteWorkStage(substage, workStage.id)} className="bg-destructive hover:bg-destructive/90">Διαγραφή</AlertDialogAction></AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        </React.Fragment>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
