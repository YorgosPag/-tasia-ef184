
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
import type { Phase, PhaseWithSubphases } from '@/app/projects/[id]/page';

interface PhaseTableProps {
    phases: PhaseWithSubphases[];
    companies: Company[];
    onAddSubphase: (parentId: string) => void;
    onEditPhase: (phase: Phase, parentId?: string) => void;
    onDeletePhase: (phase: Phase, parentId?: string) => void;
}

const formatDate = (timestamp?: Timestamp | Date) => {
    if (!timestamp) return '-';
    const date = timestamp instanceof Timestamp ? timestamp.toDate() : timestamp;
    return format(date, 'dd/MM/yyyy');
};
  
const getStatusVariant = (status: Phase['status']) => {
    switch (status) {
        case 'Ολοκληρώθηκε': return 'default';
        case 'Σε εξέλιξη': return 'secondary';
        case 'Καθυστερεί': return 'destructive';
        default: return 'outline';
    }
};

const getCompanyName = (companyId: string | undefined, companies: Company[]) => {
    if (!companyId) return '-';
    return companies.find(c => c.id === companyId)?.name || 'Άγνωστη εταιρεία';
};

export function PhaseTable({
    phases,
    companies,
    onAddSubphase,
    onEditPhase,
    onDeletePhase,
}: PhaseTableProps) {
    return (
        <div className="w-full overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Φάση / Υποφάση</TableHead>
                        <TableHead>Κατάσταση</TableHead>
                        <TableHead>Υπεύθυνος</TableHead>
                        <TableHead>Έναρξη</TableHead>
                        <TableHead>Λήξη</TableHead>
                        <TableHead>Προθεσμία</TableHead>
                        <TableHead className="text-right">Ενέργειες</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {phases.map(phase => (
                        <React.Fragment key={phase.id}>
                        <TableRow className="group bg-muted/20">
                            <TableCell className="font-bold">{phase.name}</TableCell>
                            <TableCell><Badge variant={getStatusVariant(phase.status)}>{phase.status}</Badge></TableCell>
                            <TableCell>{getCompanyName(phase.assignedTo, companies)}</TableCell>
                            <TableCell>{formatDate(phase.startDate)}</TableCell>
                            <TableCell>{formatDate(phase.endDate)}</TableCell>
                            <TableCell>{formatDate(phase.deadline)}</TableCell>
                            <TableCell className="text-right">
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-end gap-1">
                                    <Button variant="ghost" size="icon" title="Προσθήκη Υποφάσης" onClick={() => onAddSubphase(phase.id)}><GitMerge className="h-4 w-4" /><span className="sr-only">Προσθήκη Υποφάσης</span></Button>
                                    <Button variant="ghost" size="icon" title="Επεξεργασία Φάσης" onClick={() => onEditPhase(phase)}><Edit className="h-4 w-4"/><span className="sr-only">Επεξεργασία Φάσης</span></Button>
                                    <AlertDialog><AlertDialogTrigger asChild><Button variant="ghost" size="icon" title="Διαγραφή Φάσης" className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4"/><span className="sr-only">Διαγραφή Φάσης</span></Button></AlertDialogTrigger>
                                        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Είστε σίγουροι;</AlertDialogTitle><AlertDialogDescription>Αυτή η ενέργεια θα διαγράψει οριστικά τη φάση "{phase.name}" και όλες τις υποφάσεις της.</AlertDialogDescription></AlertDialogHeader>
                                            <AlertDialogFooter><AlertDialogCancel>Ακύρωση</AlertDialogCancel><AlertDialogAction onClick={() => onDeletePhase(phase)} className="bg-destructive hover:bg-destructive/90">Διαγραφή</AlertDialogAction></AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </TableCell>
                        </TableRow>
                        {phase.subphases.map(subphase => (
                            <TableRow key={subphase.id} className="group">
                                <TableCell className="pl-8 text-muted-foreground"><span className="mr-2">└</span> {subphase.name}</TableCell>
                                <TableCell><Badge variant={getStatusVariant(subphase.status)}>{subphase.status}</Badge></TableCell>
                                <TableCell>{getCompanyName(subphase.assignedTo, companies)}</TableCell>
                                <TableCell>{formatDate(subphase.startDate)}</TableCell>
                                <TableCell>{formatDate(subphase.endDate)}</TableCell>
                                <TableCell>{formatDate(subphase.deadline)}</TableCell>
                                <TableCell className="text-right">
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-end gap-2">
                                        <Button variant="ghost" size="icon" title="Επεξεργασία Υποφάσης" onClick={() => onEditPhase(subphase, phase.id)}><Edit className="h-4 w-4"/><span className="sr-only">Επεξεργασία Υποφάσης</span></Button>
                                        <AlertDialog><AlertDialogTrigger asChild><Button variant="ghost" size="icon" title="Διαγραφή Υποφάσης" className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4"/><span className="sr-only">Διαγραφή Υποφάσης</span></Button></AlertDialogTrigger>
                                            <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Είστε σίγουροι;</AlertDialogTitle><AlertDialogDescription>Αυτή η ενέργεια θα διαγράψει οριστικά την υποφάση "{subphase.name}".</AlertDialogDescription></AlertDialogHeader>
                                                <AlertDialogFooter><AlertDialogCancel>Ακύρωση</AlertDialogCancel><AlertDialogAction onClick={() => onDeletePhase(subphase, phase.id)} className="bg-destructive hover:bg-destructive/90">Διαγραφή</AlertDialogAction></AlertDialogFooter>
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
