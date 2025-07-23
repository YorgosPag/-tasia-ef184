
'use client';

import React, { useState } from 'react';
import { PlusCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Company } from '@/hooks/use-data-store';
import { useWorkStages } from '@/hooks/use-work-stages';
import { WorkStageFormDialog } from './work-stages/WorkStageFormDialog';
import { WorkStageAccordion } from './work-stages/WorkStageAccordion';
import { WorkStageCommentForm } from './work-stages/WorkStageCommentForm';
import type { Project, WorkStage } from '@/app/projects/[id]/page';
import { WorkStagesEmptyState } from './work-stages/WorkStagesEmptyState';

interface WorkStagesSectionProps {
    project: Project;
    companies: Company[];
    isLoadingCompanies: boolean;
}

export function WorkStagesSection({ project, companies, isLoadingCompanies }: WorkStagesSectionProps) {
    const {
        workStages,
        isLoadingWorkStages,
        isSubmitting,
        form,
        editingWorkStage,
        handleEditWorkStage,
        handleAddWorkSubstage,
        handleDeleteWorkStage,
        onSubmitWorkStage,
        handleChecklistItemToggle,
        handleAddChecklistItem,
        setEditingWorkStage,
        handleCommentSubmit,
    } = useWorkStages(project.id);

    const [isWorkStageDialogOpen, setIsWorkStageDialogOpen] = useState(false);

    const openDialog = () => setIsWorkStageDialogOpen(true);
    const closeDialog = () => {
        setIsWorkStageDialogOpen(false);
        setEditingWorkStage(null);
        form.reset();
    };
    
    // Bridge functions to open the dialog when an edit/add action is triggered from the hook
    const handleEdit = (workStage: WorkStage, parentId?: string) => {
        handleEditWorkStage(workStage, parentId);
        openDialog();
    };

    const handleAddSubstage = (parentId: string) => {
        handleAddWorkSubstage(parentId);
        openDialog();
    };
    
    const handleAddNewStage = () => {
        setEditingWorkStage(null);
        form.reset({ status: 'Εκκρεμεί', name: '', description: '', notes: '', documents: '', assignedTo: '' });
        openDialog();
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Στάδια Εργασίας</CardTitle>
                    <Button size="sm" onClick={handleAddNewStage}><PlusCircle className="mr-2"/>Νέο Στάδιο Εργασίας</Button>
                </div>
            </CardHeader>
            <CardContent>
                {isLoadingWorkStages ? (
                    <div className="flex justify-center items-center h-24"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
                ) : workStages.length > 0 ? (
                    <WorkStageAccordion
                        workStages={workStages}
                        companies={companies}
                        onAddWorkSubstage={handleAddSubstage}
                        onEditWorkStage={handleEdit}
                        onDeleteWorkStage={handleDeleteWorkStage}
                        onChecklistItemToggle={handleChecklistItemToggle}
                        onAddChecklistItem={handleAddChecklistItem}
                    />
                ) : (
                    <WorkStagesEmptyState onAddNewStage={handleAddNewStage}/>
                )}
            </CardContent>
            
            <WorkStageCommentForm onSubmit={handleCommentSubmit}/>

            <WorkStageFormDialog 
                open={isWorkStageDialogOpen}
                onOpenChange={closeDialog}
                form={form}
                onSubmit={form.handleSubmit(onSubmitWorkStage)}
                isSubmitting={isSubmitting}
                editingWorkStage={editingWorkStage}
                companies={companies}
                isLoadingCompanies={isLoadingCompanies}
            />
        </Card>
    );
}
