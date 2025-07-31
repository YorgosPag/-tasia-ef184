
'use client';

import React, { useState } from 'react';
import { PlusCircle, Loader2, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCompanies } from '@/hooks/use-data-store';
import { useWorkStages } from '@/hooks/use-work-stages';
import { WorkStageFormDialog } from '@/components/projects/work-stages/WorkStageFormDialog';
import { WorkStageAccordion } from '@/components/projects/work-stages/WorkStageAccordion';
import type { Project, WorkStage } from '@/lib/types/project-types';
import { WorkStagesEmptyState } from '@/components/projects/work-stages/WorkStagesEmptyState';
import { useAuth } from '@/hooks/use-auth';

interface WorkStagesSectionProps {
    project: Project;
}

export function WorkStagesSection({ project }: WorkStagesSectionProps) {
    const { isEditor } = useAuth();
    const { companies, isLoading: isLoadingCompanies } = useCompanies();

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
        handleInspectionNotesChange,
        setEditingWorkStage,
        handlePhotoUpload,
        handleCommentSubmit,
        handleExport,
    } = useWorkStages(project.id, project.title);

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
                    <div className="flex items-center gap-2">
                         <Button size="sm" variant="outline" onClick={handleExport} disabled={isLoadingWorkStages || workStages.length === 0}>
                            <Download className="mr-2"/>Εξαγωγή Αναφοράς
                        </Button>
                        {isEditor && <Button size="sm" onClick={handleAddNewStage}><PlusCircle className="mr-2"/>Νέο Στάδιο Εργασίας</Button>}
                    </div>
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
                        onInspectionNotesChange={handleInspectionNotesChange}
                        onPhotoUpload={handlePhotoUpload}
                        onCommentSubmit={handleCommentSubmit}
                    />
                ) : (
                    <WorkStagesEmptyState onAddNewStage={handleAddNewStage}/>
                )}
            </CardContent>
            
            {isEditor && <WorkStageFormDialog 
                open={isWorkStageDialogOpen}
                onOpenChange={closeDialog}
                form={form}
                onSubmit={form.handleSubmit(onSubmitWorkStage)}
                isSubmitting={isSubmitting}
                editingWorkStage={editingWorkStage}
                companies={companies}
                isLoadingCompanies={isLoadingCompanies}
            />}
        </Card>
    );
}
