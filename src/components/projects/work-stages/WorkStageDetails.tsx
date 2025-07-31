
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, GitMerge, Briefcase, FileText, Calendar, Clock, User, CheckCircle, GripVertical, DollarSign, AlertCircle, Link2 } from 'lucide-react';
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
import type { WorkStage, WorkStageWithSubstages } from '@/lib/types/project-types';
import { Checklist } from './Checklist';
import { formatDate, getCompanyNames, formatCurrency, getStatusVariant, calculateChecklistProgress } from './utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { WorkStagePhotoGallery } from './WorkStagePhotoGallery';
import { WorkStageCommentsThread } from './WorkStageCommentsThread';
import { WorkStageCommentForm } from './WorkStageCommentForm';
import { WorkStageItem } from './WorkStageItem';

const DetailItem = ({ icon, label, children }: { icon: React.ElementType, label: string, children: React.ReactNode }) => (
    <div className="flex items-start gap-2 text-sm">
        {React.createElement(icon, { className: 'h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0' })}
        <span className="font-semibold">{label}:</span>
        <span className="text-muted-foreground break-words">{children}</span>
    </div>
);


export function WorkStageDetails({
    stage,
    companies,
    onChecklistItemToggle,
    onAddChecklistItem,
    onAddWorkSubstage,
    onEditWorkStage,
    onDeleteWorkStage,
    onPhotoUpload,
    onInspectionNotesChange,
    onCommentSubmit,
    isSubstage
}: {
    stage: WorkStageWithSubstages;
    companies: Company[];
    onChecklistItemToggle: (stage: WorkStage, itemIndex: number, completed: boolean, isSubstage: boolean) => void, 
    onAddChecklistItem: (stage: WorkStage, task: string, isSubstage: boolean) => void, 
    onAddWorkSubstage?: (parentId: string) => void;
    onEditWorkStage: (workStage: WorkStage, parentId?: string) => void;
    onDeleteWorkStage: (workStage: WorkStage, parentId?: string) => void;
    onPhotoUpload: (stage: WorkStage, files: FileList, isSubstage: boolean) => void;
    onInspectionNotesChange: (stage: WorkStage, itemIndex: number, notes: string, isSubstage: boolean) => void;
    onCommentSubmit: (stage: WorkStage, comment: string, isSubstage: boolean) => void;
    isSubstage: boolean;
}) {

    const checklistProgress = calculateChecklistProgress(stage.checklist);
    const canCompleteStage = checklistProgress === 100;

    return (
        <div className="space-y-4 py-4">
             {stage.status !== 'Ολοκληρώθηκε' && !canCompleteStage && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Εκκρεμείς Επιθεωρήσεις</AlertTitle>
                    <AlertDescription>
                        Το στάδιο δεν μπορεί να ολοκληρωθεί. Παρακαλώ ολοκληρώστε όλα τα αντικείμενα του checklist επιθεώρησης.
                    </AlertDescription>
                </Alert>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2">
                <DetailItem icon={User} label="Ανάθεση">{getCompanyNames(stage.assignedTo, companies)}</DetailItem>
                <DetailItem icon={Calendar} label="Έναρξη">{formatDate(stage.startDate)}</DetailItem>
                <DetailItem icon={CheckCircle} label="Λήξη">{formatDate(stage.endDate)}</DetailItem>
                <DetailItem icon={Clock} label="Προθεσμία">{formatDate(stage.deadline)}</DetailItem>
                <DetailItem icon={DollarSign} label="Budget">{formatCurrency(stage.budgetedCost)}</DetailItem>
                <DetailItem icon={DollarSign} label="Actual">{formatCurrency(stage.actualCost)}</DetailItem>
                <DetailItem icon={Briefcase} label="Σχετίζεται με">{(stage as any).relatedEntityIds?.join(', ') || '-'}</DetailItem>
                <DetailItem icon={Link2} label="Εξαρτάται από">{stage.dependsOn?.join(', ') || '-'}</DetailItem>
                {stage.notes && <div className="col-span-full"><DetailItem icon={GripVertical} label="Σημειώσεις">{stage.notes}</DetailItem></div>}
            </div>

            <WorkStagePhotoGallery 
                stage={stage} 
                onPhotoUpload={(files) => onPhotoUpload(stage, files, isSubstage)}
            />

            <Checklist 
                stage={stage} 
                onToggle={(index, completed) => onChecklistItemToggle(stage, index, completed, isSubstage)} 
                onAdd={(task) => onAddChecklistItem(stage, task, isSubstage)} 
                onNotesChange={(index, notes) => onInspectionNotesChange(stage, index, notes, isSubstage)}
            />

            {stage.workSubstages && stage.workSubstages.length > 0 && (
                <div className="ml-4 mt-2 border-l-2 pl-4">
                    <h4 className="font-semibold mb-2">Υποστάδια:</h4>
                    {stage.workSubstages.map(substage => (
                        <div key={substage.id} className="mb-4 p-2 rounded-md hover:bg-muted/30">
                           <WorkStageItem stage={{...substage, workSubstages: []}} isSubstage={true} />
                           <WorkStageDetails
                                stage={{...substage, workSubstages: []}}
                                companies={companies}
                                onChecklistItemToggle={onChecklistItemToggle}
                                onAddChecklistItem={onAddChecklistItem}
                                onEditWorkStage={onEditWorkStage}
                                onDeleteWorkStage={onDeleteWorkStage}
                                onPhotoUpload={onPhotoUpload}
                                onInspectionNotesChange={onInspectionNotesChange}
                                onCommentSubmit={onCommentSubmit}
                                isSubstage={true}
                           />
                        </div>
                    ))}
                </div>
            )}
            
            {!isSubstage && (
                <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                    <Button variant="outline" size="sm" onClick={() => onAddWorkSubstage?.(stage.id)}><GitMerge className="mr-2"/>Νέο Υποστάδιο</Button>
                    <Button variant="outline" size="sm" onClick={() => onEditWorkStage(stage)}><Edit className="mr-2"/>Επεξεργασία Σταδίου</Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild><Button variant="destructive_outline" size="sm"><Trash2 className="mr-2"/>Διαγραφή Σταδίου</Button></AlertDialogTrigger>
                        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Είστε σίγουροι;</AlertDialogTitle><AlertDialogDescription>Αυτή η ενέργεια θα διαγράψει οριστικά το στάδιο &quot;{stage.name}&quot; και όλα τα υποστάδια του.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Ακύρωση</AlertDialogCancel><AlertDialogAction onClick={() => onDeleteWorkStage(stage)} className="bg-destructive hover:bg-destructive/90">Διαγραφή</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
                    </AlertDialog>
                </div>
            )}
            
             <div className="mt-6 border-t pt-4">
                <WorkStageCommentsThread comments={stage.comments || []} />
                <WorkStageCommentForm onSubmit={(comment) => onCommentSubmit(stage, comment, isSubstage)} />
            </div>

        </div>
    )
}
