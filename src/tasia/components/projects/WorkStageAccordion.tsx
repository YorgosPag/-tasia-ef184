
'use client';

import React, { useState, useMemo } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/components/ui/accordion';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Edit, Trash2, GitMerge, Briefcase, FileText, Calendar, Clock, User, CheckCircle, GripVertical, Plus, DollarSign } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';
import { format } from 'date-fns';
import { Company } from '@/shared/hooks/use-data-store';
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
} from "@/shared/components/ui/alert-dialog";
import { Progress } from '@/shared/components/ui/progress';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import type { WorkStage, WorkStageWithSubstages, ChecklistItem } from '@/tasia/app/projects/[id]/page';

interface WorkStageAccordionProps {
    workStages: WorkStageWithSubstages[];
    companies: Company[];
    onAddWorkSubstage: (parentId: string) => void;
    onEditWorkStage: (workStage: WorkStage, parentId?: string) => void;
    onDeleteWorkStage: (workStage: WorkStage, parentId?: string) => void;
    onChecklistItemToggle: (stage: WorkStage, itemIndex: number, completed: boolean, isSubstage: boolean) => void;
    onAddChecklistItem: (stage: WorkStage, task: string, isSubstage: boolean) => void;
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

const formatCurrency = (value?: number) => {
    if (value === undefined || value === null) return '-';
    return `€${value.toLocaleString('el-GR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const DetailItem = ({ icon, label, children }: { icon: React.ElementType, label: string, children: React.ReactNode }) => (
    <div className="flex items-start gap-2 text-sm">
        {React.createElement(icon, { className: 'h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0' })}
        <span className="font-semibold">{label}:</span>
        <span className="text-muted-foreground break-words">{children}</span>
    </div>
);

const Checklist = ({ stage, onToggle, onAdd }: { stage: WorkStage, onToggle: (itemIndex: number, completed: boolean) => void, onAdd: (task: string) => void }) => {
    const [newTask, setNewTask] = useState('');
    
    const progress = useMemo(() => {
        const totalTasks = stage.checklist?.length || 0;
        if (totalTasks === 0) return 0;
        const completedTasks = stage.checklist?.filter(item => item.completed).length || 0;
        return (completedTasks / totalTasks) * 100;
    }, [stage.checklist]);
    
    const handleAddTask = () => {
        if(newTask.trim()) {
            onAdd(newTask.trim());
            setNewTask('');
        }
    }

    return (
        <div className="mt-4 space-y-3">
            <h4 className="font-semibold">Checklist Εργασιών</h4>
             {stage.checklist && stage.checklist.length > 0 && (
                <div>
                    <Progress value={progress} className="w-full h-2"/>
                    <p className="text-xs text-muted-foreground mt-1 text-right">{Math.round(progress)}% Ολοκληρώθηκε</p>
                </div>
             )}
            <div className="space-y-2">
                {stage.checklist?.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 bg-muted/50 p-2 rounded-md">
                        <Checkbox 
                            id={`task-${stage.id}-${index}`} 
                            checked={item.completed} 
                            onCheckedChange={(checked) => onToggle(index, !!checked)}
                        />
                        <Label htmlFor={`task-${stage.id}-${index}`} className={`flex-1 ${item.completed ? 'line-through text-muted-foreground' : ''}`}>{item.task}</Label>
                    </div>
                ))}
            </div>
            <div className="flex items-center gap-2">
                <Input value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="Νέα εργασία..." onKeyDown={(e) => e.key === 'Enter' && handleAddTask()} />
                <Button size="sm" onClick={handleAddTask}><Plus className="mr-2 h-4 w-4"/>Προσθήκη</Button>
            </div>
        </div>
    )
}

const StageDetails = ({ stage, companies, onChecklistItemToggle, onAddChecklistItem, isSubstage = false }: {stage: WorkStage, companies: Company[], onChecklistItemToggle: (stage: WorkStage, itemIndex: number, completed: boolean, isSubstage: boolean) => void, onAddChecklistItem: (stage: WorkStage, task: string, isSubstage: boolean) => void, isSubstage?: boolean}) => (
     <div className="space-y-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2">
            <DetailItem icon={User} label="Ανάθεση">{getCompanyNames(stage.assignedTo, companies)}</DetailItem>
            <DetailItem icon={Calendar} label="Έναρξη">{formatDate(stage.startDate)}</DetailItem>
            <DetailItem icon={CheckCircle} label="Λήξη">{formatDate(stage.endDate)}</DetailItem>
            <DetailItem icon={Clock} label="Προθεσμία">{formatDate(stage.deadline)}</DetailItem>
            <DetailItem icon={DollarSign} label="Budget">{formatCurrency(stage.budgetedCost)}</DetailItem>
            <DetailItem icon={DollarSign} label="Actual">{formatCurrency(stage.actualCost)}</DetailItem>
            <DetailItem icon={FileText} label="Έγγραφα">
                {stage.documents && stage.documents.length > 0
                    ? stage.documents.map((doc, i) => <a key={i} href={doc} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{`Έγγραφο ${i+1}`}</a>).reduce((prev, curr) => <>{prev}, {curr}</>)
                    : 'Κανένα'
                }
            </DetailItem>
            <DetailItem icon={Briefcase} label="Σχετίζεται με">{(stage as any).relatedEntityIds?.join(', ') || '-'}</DetailItem>
            {stage.notes && <div className="col-span-full"><DetailItem icon={GripVertical} label="Σημειώσεις">{stage.notes}</DetailItem></div>}
        </div>
        <Checklist stage={stage} onToggle={(index, completed) => onChecklistItemToggle(stage, index, completed, isSubstage)} onAdd={(task) => onAddChecklistItem(stage, task, isSubstage)} />
    </div>
)


export function WorkStageAccordion({
    workStages,
    companies,
    onAddWorkSubstage,
    onEditWorkStage,
    onDeleteWorkStage,
    onChecklistItemToggle,
    onAddChecklistItem,
}: WorkStageAccordionProps) {
    const calculateStageProgress = (stage: WorkStageWithSubstages): number => {
        const checklistProgress = stage.checklist?.length > 0 ? (stage.checklist.filter(c => c.completed).length / stage.checklist.length) * 100 : 0;
        
        if (stage.workSubstages?.length > 0) {
            const substagesProgress = stage.workSubstages.map(ss => (ss.checklist?.length > 0 ? (ss.checklist.filter(c => c.completed).length / ss.checklist.length) * 100 : 0));
            const totalSubstageProgress = substagesProgress.reduce((acc, p) => acc + p, 0) / stage.workSubstages.length;
            // Weighted average: 50% for own checklist, 50% for substages
            return (checklistProgress * 0.5) + (totalSubstageProgress * 0.5);
        }

        return checklistProgress;
    }
    
    return (
        <Accordion type="multiple" className="w-full">
            {workStages.map(stage => {
                const progress = calculateStageProgress(stage);

                return (
                    <AccordionItem key={stage.id} value={stage.id}>
                        <AccordionTrigger className="hover:bg-muted/50 px-4 rounded-md">
                            <div className="flex items-center gap-4 flex-1">
                                <Badge variant={getStatusVariant(stage.status)}>{stage.status}</Badge>
                                <span className="font-bold text-base">{stage.name}</span>
                                <div className="flex items-center gap-2 ml-auto w-32">
                                    <Progress value={progress} className="h-2 flex-1" />
                                    <span className="text-xs font-mono text-muted-foreground">{Math.round(progress)}%</span>
                                </div>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pt-0">
                        <StageDetails stage={stage} companies={companies} onChecklistItemToggle={onChecklistItemToggle} onAddChecklistItem={onAddChecklistItem} isSubstage={false} />
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
                                        <StageDetails stage={substage} companies={companies} onChecklistItemToggle={onChecklistItemToggle} onAddChecklistItem={onAddChecklistItem} isSubstage={true} />
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
                )
            })}
        </Accordion>
    );
}
