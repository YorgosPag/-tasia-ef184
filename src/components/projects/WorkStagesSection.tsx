
'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import {
  doc,
  collection,
  onSnapshot,
  writeBatch,
  updateDoc,
  deleteDoc,
  orderBy,
  query,
  getDocs,
  Timestamp,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PlusCircle, Loader2, MessageSquare, Paperclip } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { logActivity } from '@/lib/logger';
import { Company } from '@/hooks/use-data-store';
import { WorkStageFormDialog } from './PhaseFormDialog';
import { WorkStageAccordion } from './WorkStageAccordion';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '../ui/input';
import type { Project, WorkStage, WorkStageWithSubstages } from '@/app/projects/[id]/page';

// Schema for the work stage form
const workStageSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, 'Το όνομα είναι υποχρεωτικό.'),
    description: z.string().optional(),
    status: z.enum(['Εκκρεμεί', 'Σε εξέλιξη', 'Ολοκληρώθηκε', 'Καθυστερεί']),
    assignedTo: z.string().optional(), // Now a string of comma-separated IDs
    relatedEntityIds: z.string().optional(),
    notes: z.string().optional(),
    startDate: z.date().optional().nullable(),
    endDate: z.date().optional().nullable(),
    deadline: z.date().optional().nullable(),
    documents: z.string().optional(), // URLs separated by comma
});

export type WorkStageFormValues = z.infer<typeof workStageSchema>;


interface WorkStagesSectionProps {
    project: Project;
    companies: Company[];
    isLoadingCompanies: boolean;
}

export function WorkStagesSection({ project, companies, isLoadingCompanies }: WorkStagesSectionProps) {
    const { toast } = useToast();
    const [workStages, setWorkStages] = useState<WorkStageWithSubstages[]>([]);
    const [isLoadingWorkStages, setIsLoadingWorkStages] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isWorkStageDialogOpen, setIsWorkStageDialogOpen] = useState(false);
    const [editingWorkStage, setEditingWorkStage] = useState<WorkStage | { parentId: string } | null>(null);

    const form = useForm<WorkStageFormValues>({
        resolver: zodResolver(workStageSchema),
        defaultValues: {
            id: undefined, name: '', status: 'Εκκρεμεί', assignedTo: '', notes: '',
            startDate: null, endDate: null, deadline: null,
            documents: '', description: '', relatedEntityIds: '',
        }
    });

    useEffect(() => {
        if (!project.id) return;
        
        const workStagesQuery = query(collection(db, 'projects', project.id, 'workStages'), orderBy('createdAt', 'asc'));
        
        const unsubscribe = onSnapshot(workStagesQuery, async (workStagesSnapshot) => {
            const workStagesDataPromises = workStagesSnapshot.docs.map(async (doc) => {
                const workStage = { id: doc.id, ...doc.data(), workSubstages: [] } as WorkStageWithSubstages;
                const workSubstagesQuery = query(collection(db, 'projects', project.id, 'workStages', workStage.id, 'workSubstages'), orderBy('createdAt', 'asc'));
                const workSubstagesSnapshot = await getDocs(workSubstagesQuery);
                workStage.workSubstages = workSubstagesSnapshot.docs.map(subDoc => ({ id: subDoc.id, ...subDoc.data() } as WorkStage));
                return workStage;
            });

            const workStagesData = await Promise.all(workStagesDataPromises);
            setWorkStages(workStagesData);
            setIsLoadingWorkStages(false);
        },
        (error) => {
            console.error("Error fetching work stages:", error);
            setIsLoadingWorkStages(false);
        });

        return () => unsubscribe();
    }, [project.id]);

    const handleWorkStageDialogOpenChange = (open: boolean) => {
        setIsWorkStageDialogOpen(open);
        if(!open) {
            form.reset();
            setEditingWorkStage(null);
        }
    };

    const handleEditWorkStage = (workStage: WorkStage, parentId?: string) => {
        setEditingWorkStage(parentId ? { ...workStage, parentId } as any : workStage);
        form.reset({
            ...workStage,
            description: workStage.description || '',
            notes: workStage.notes || '',
            assignedTo: workStage.assignedTo?.join(', ') || '',
            documents: workStage.documents?.join(', ') || '',
            relatedEntityIds: (workStage as any).relatedEntityIds?.join(', ') || '',
            startDate: workStage.startDate?.toDate() || null,
            endDate: workStage.endDate?.toDate() || null,
            deadline: workStage.deadline?.toDate() || null,
        });
        setIsWorkStageDialogOpen(true);
    }
    
    const handleAddWorkSubstage = (parentId: string) => {
        setEditingWorkStage({ parentId });
        form.reset({ status: 'Εκκρεμεί', name: '', description: '', notes: '', documents: '', assignedTo: '' });
        setIsWorkStageDialogOpen(true);
    };

    const handleDeleteWorkStage = async (workStage: WorkStage, parentId?: string) => {
        if (!project.id) return;
        try {
          const docPath = parentId
            ? doc(db, 'projects', project.id, 'workStages', parentId, 'workSubstages', workStage.id)
            : doc(db, 'projects', project.id, 'workStages', workStage.id);
          await deleteDoc(docPath);
          toast({ title: 'Επιτυχία', description: 'Το Στάδιο Εργασίας διαγράφηκε.' });
          await logActivity(parentId ? 'DELETE_WORK_SUBSTAGE' : 'DELETE_WORK_STAGE', {
            entityId: workStage.id,
            entityType: parentId ? 'workSubstage' : 'workStage',
            details: { name: workStage.name, parentId: parentId },
          });
        } catch (error) {
          console.error("Error deleting work stage/substage:", error);
          toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Η διαγραφή απέτυχε.' });
        }
      }

    const onSubmitWorkStage = async (data: WorkStageFormValues) => {
        if (!project.id) return;
        setIsSubmitting(true);

        const rawData: any = {
            name: data.name, description: data.description || '', status: data.status,
            assignedTo: data.assignedTo ? data.assignedTo.split(',').map(s => s.trim()).filter(Boolean) : [],
            relatedEntityIds: data.relatedEntityIds ? data.relatedEntityIds.split(',').map(s => s.trim()).filter(Boolean) : [],
            notes: data.notes || '', startDate: data.startDate,
            endDate: data.endDate, deadline: data.deadline,
            documents: data.documents ? data.documents.split(',').map(s => s.trim()).filter(Boolean) : [],
        };
        
        const finalData = Object.fromEntries(Object.entries(rawData).filter(([_, v]) => v !== undefined && v !== null && v !== ''));
        
        if (finalData.startDate) finalData.startDate = Timestamp.fromDate(finalData.startDate as Date);
        if (finalData.endDate) finalData.endDate = Timestamp.fromDate(finalData.endDate as Date);
        if (finalData.deadline) finalData.deadline = Timestamp.fromDate(finalData.deadline as Date);


        try {
            const isSubstage = editingWorkStage && 'parentId' in editingWorkStage;
            const isEditing = editingWorkStage && 'id' in editingWorkStage;

            if (isEditing) {
                const parentId = (editingWorkStage as any).parentId;
                const workStageId = (editingWorkStage as WorkStage).id;
                const docRef = parentId
                    ? doc(db, 'projects', project.id, 'workStages', parentId, 'workSubstages', workStageId)
                    : doc(db, 'projects', project.id, 'workStages', workStageId);
                await updateDoc(docRef, finalData);
                toast({ title: 'Επιτυχία', description: 'Το Στάδιο Εργασίας ενημερώθηκε.' });
                await logActivity(parentId ? 'UPDATE_WORK_SUBSTAGE' : 'UPDATE_WORK_STAGE', {
                    entityId: workStageId,
                    entityType: parentId ? 'workSubstage' : 'workStage',
                    changes: finalData,
                });

            } else {
                 const parentId = isSubstage ? (editingWorkStage as { parentId: string }).parentId : null;
                 const collectionPath = parentId
                    ? collection(db, 'projects', project.id, 'workStages', parentId, 'workSubstages')
                    : collection(db, 'projects', project.id, 'workStages');
                const newDocRef = await addDoc(collectionPath, { ...finalData, createdAt: serverTimestamp() });
                toast({ title: 'Επιτυχία', description: `Το ${isSubstage ? 'υποστάδιο εργασίας' : 'στάδιο εργασίας'} προστέθηκε.` });
                await logActivity(isSubstage ? 'CREATE_WORK_SUBSTAGE' : 'CREATE_WORK_STAGE', {
                    entityId: newDocRef.id,
                    entityType: isSubstage ? 'workSubstage' : 'workStage',
                    details: finalData,
                });
            }
            handleWorkStageDialogOpenChange(false);
        } catch (error) {
            console.error("Error submitting work stage/substage:", error);
            toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Η υποβολή απέτυχε.' });
        } finally {
            setIsSubmitting(false);
        }
    }
      
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Στάδια Εργασίας</CardTitle>
                    <Button size="sm" onClick={() => handleWorkStageDialogOpenChange(true)}><PlusCircle className="mr-2"/>Νέο Στάδιο Εργασίας</Button>
                </div>
            </CardHeader>
            <CardContent>
                {isLoadingWorkStages ? (
                    <div className="flex justify-center items-center h-24"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
                ) : workStages.length > 0 ? (
                    <WorkStageAccordion
                        workStages={workStages}
                        companies={companies}
                        onAddWorkSubstage={handleAddWorkSubstage}
                        onEditWorkStage={handleEditWorkStage}
                        onDeleteWorkStage={handleDeleteWorkStage}
                    />
                ) : (
                    <p className="text-center text-muted-foreground py-8">Δεν υπάρχουν καταχωρημένα στάδια εργασίας για αυτό το έργο.</p>
                )}
            </CardContent>
            <CardFooter>
                 <div className="w-full space-y-2">
                    <h4 className="text-sm font-medium">Προσθήκη Σχολίου</h4>
                     <Textarea placeholder="Γράψτε το σχόλιό σας..." className="w-full"/>
                     <div className="flex justify-between items-center">
                        <Input type="file" className="max-w-xs text-xs" multiple/>
                         <Button size="sm">
                             <MessageSquare className="mr-2"/>
                             Υποβολή
                         </Button>
                     </div>
                 </div>
            </CardFooter>
            <WorkStageFormDialog 
                open={isWorkStageDialogOpen}
                onOpenChange={handleWorkStageDialogOpenChange}
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
