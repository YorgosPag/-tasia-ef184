
'use client';

import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Company } from '@/hooks/use-data-store';
import type { WorkStage, WorkStageWithSubstages } from '@/lib/types/project-types';
import { WorkStageItem } from './WorkStageItem';
import { WorkStageDetails } from './WorkStageDetails';

interface WorkStageAccordionProps {
    workStages: WorkStageWithSubstages[];
    companies: Company[];
    onAddWorkSubstage: (parentId: string) => void;
    onEditWorkStage: (workStage: WorkStage, parentId?: string) => void;
    onDeleteWorkStage: (workStage: WorkStage, parentId?: string) => void;
    onChecklistItemToggle: (stage: WorkStage, itemIndex: number, completed: boolean, isSubstage: boolean) => void;
    onAddChecklistItem: (stage: WorkStage, task: string, isSubstage: boolean) => void;
    onPhotoUpload: (stage: WorkStage, files: FileList, isSubstage: boolean) => void;
    onInspectionNotesChange: (stage: WorkStage, itemIndex: number, notes: string, isSubstage: boolean) => void;
    onCommentSubmit: (stage: WorkStage, comment: string, isSubstage: boolean) => void;
}


export function WorkStageAccordion({
    workStages,
    companies,
    onAddWorkSubstage,
    onEditWorkStage,
    onDeleteWorkStage,
    onChecklistItemToggle,
    onAddChecklistItem,
    onInspectionNotesChange,
    onPhotoUpload,
    onCommentSubmit,
}: WorkStageAccordionProps) {
    return (
        <Accordion type="multiple" className="w-full">
            {workStages.map(stage => (
                <AccordionItem key={stage.id} value={stage.id}>
                    <AccordionTrigger className="hover:bg-muted/50 px-4 rounded-md">
                       <WorkStageItem stage={stage} isSubstage={false} />
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pt-0">
                        <WorkStageDetails
                            stage={stage}
                            companies={companies}
                            onChecklistItemToggle={onChecklistItemToggle}
                            onAddChecklistItem={onAddChecklistItem}
                            onAddWorkSubstage={onAddWorkSubstage}
                            onEditWorkStage={onEditWorkStage}
                            onDeleteWorkStage={onDeleteWorkStage}
                            onPhotoUpload={onPhotoUpload}
                            onInspectionNotesChange={onInspectionNotesChange}
                            onCommentSubmit={onCommentSubmit}
                            isSubstage={false}
                        />
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
}
