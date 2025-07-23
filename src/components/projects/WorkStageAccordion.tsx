
'use client';

import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, GitMerge, Briefcase, FileText, Calendar, Clock, User, CheckCircle, GripVertical } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';
import { format } from 'date-fns';
import { Company } from '@/hooks/use-data-store';
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
import type { WorkStage, WorkStageWithSubstages } from '@/app/projects/[id]/page';

interface WorkStageAccordionProps {
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
    if (!companyIds || companyIds.length === 0) return 'Κανένας';
    return companyIds.map(id => companies.find(c => c.id === id)?.name || id).join(', ');
};

const DetailItem = ({ icon, label, children }: { icon: React.ElementType, label: string, children: React.ReactNode }) => (
    <div className="flex items-start gap-2 text-sm">
        {React.createElement(icon, { className: 'h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0' })}
        <span className="font-semibold">{label}:</span>
        <span className="text-muted-foreground break-words">{children}</span>
    </div>
);

const StageDetails = ({ stage, companies }: {stage: WorkStage, companies: Company[]}) => (
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2 py-4">
        <DetailItem icon={User} label="Ανάθεση">{getCompanyNames(stage.assignedTo, companies)}</DetailItem>
        <DetailItem icon={Calendar} label="Έναρξη">{formatDate(stage.startDate)}</DetailItem>
        <DetailItem icon={CheckCircle} label="Λήξη">{formatDate(stage.endDate)}</DetailItem>
        <DetailItem icon={Clock} label="Προθεσμία">{formatDate(stage.deadline)}</DetailItem>
        <DetailItem icon={FileText} label="Έγγραφα">
            {stage.documents && stage.documents.length > 0
                ? stage.documents.map((doc, i) => <a key={i} href={doc} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{`Έγγραφο ${i+1}`}</a>).reduce((prev, curr) => <>{prev}, {curr}</>)
                : 'Κανένα'
            }
        </DetailItem>
        <DetailItem icon={Briefcase} label="Σχετίζεται με">{(stage as any).relatedEntityIds?.join(', ') || '-'}</DetailItem>
        {stage.notes && <div className="col-span-full"><DetailItem icon={GripVertical} label="Σημειώσεις">{stage.notes}</DetailItem></div>}
    </div>
)


export function WorkStageAccordion({
    workStages,
    companies,
    onAddWorkSubstage,
    onEditWorkStage,
    onDeleteWorkStage,
}: WorkStageAccordionProps) {
    return (
        <Accordion type="multiple" className="w-full">
            {workStages.map(stage => (
                <AccordionItem key={stage.id} value={stage.id}>
                    <AccordionTrigger className="hover:bg-muted/50 px-4 rounded-md">
                        <div className="flex items-center gap-4 flex-1">
                             <Badge variant={getStatusVariant(stage.status)}>{stage.status}</Badge>
                             <span className="font-bold text-base">{stage.name}</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pt-0">
                       <StageDetails stage={stage} companies={companies} />
                        {stage.workSubstages.length > 0 && (
                            <div className="ml-4 mt-2 border-l-2 pl-4">
                                <h4 className="font-semibold mb-2">Υποστάδια:</h4>
                                {stage.workSubstages.map(substage => (
                                    <div key={substage.id} className="mb-4 p-2 rounded-md hover:bg-muted/30">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                 <Badge variant={getStatusVariant(substage.status)}>{substage.status}</Badge>
                                                 <p className="font-semibold">{substage.name}</p>
                                            </div>
                                             <div className="flex items-center gap-1">
                                                <Button variant="ghost" size="icon" title="Επεξεργασία Υποσταδίου" onClick={() => onEditWorkStage(substage, stage.id)}><Edit className="h-4 w-4"/></Button>
                                                <AlertDialog><AlertDialogTrigger asChild><Button variant="ghost" size="icon" title="Διαγραφή Υποσταδίου" className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4"/></Button></AlertDialogTrigger>
                                                <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Είστε σίγουροι;</AlertDialogTitle><AlertDialogDescription>Αυτή η ενέργεια θα διαγράψει οριστικά το υποστάδιο "{substage.name}".</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Ακύρωση</AlertDialogCancel><AlertDialogAction onClick={() => onDeleteWorkStage(substage, stage.id)} className="bg-destructive hover:bg-destructive/90">Διαγραφή</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
                                            </div>
                                        </div>
                                       <StageDetails stage={substage} companies={companies}/>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                             <Button variant="outline" size="sm" onClick={() => onAddWorkSubstage(stage.id)}><GitMerge className="mr-2"/>Νέο Υποστάδιο</Button>
                             <Button variant="outline" size="sm" onClick={() => onEditWorkStage(stage)}><Edit className="mr-2"/>Επεξεργασία Σταδίου</Button>
                             <AlertDialog><AlertDialogTrigger asChild><Button variant="destructive_outline" size="sm"><Trash2 className="mr-2"/>Διαγραφή Σταδίου</Button></AlertDialogTrigger>
                             <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Είστε σίγουροι;</AlertDialogTitle><AlertDialogDescription>Αυτή η ενέργεια θα διαγράψει οριστικά το στάδιο "{stage.name}" και όλες τις υποφάσεις του.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Ακύρωση</AlertDialogCancel><AlertDialogAction onClick={() => onDeleteWorkStage(stage)} className="bg-destructive hover:bg-destructive/90">Διαγραφή</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
                        </div>

                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
}

