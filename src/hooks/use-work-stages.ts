
'use client';

import { useState, useEffect, useCallback } from 'react';
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
  arrayUnion,
  setDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { logActivity } from '@/lib/logger';
import { WorkStageFormValues, workStageSchema } from '@/components/projects/work-stages/workStageSchema';
import type { WorkStage, WorkStageWithSubstages } from '@/app/projects/[id]/page';
import { exportToJson } from '@/lib/exporter';
import { formatDate } from '@/components/projects/work-stages/utils';


export function useWorkStages(projectId: string, projectTitle: string) {
    const { toast } = useToast();
    const [workStages, setWorkStages] = useState<WorkStageWithSubstages[]>([]);
    const [isLoadingWorkStages, setIsLoadingWorkStages] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingWorkStage, setEditingWorkStage] = useState<WorkStage | { parentId: string } | null>(null);

    const form = useForm<WorkStageFormValues>({
        resolver: zodResolver(workStageSchema),
        defaultValues: {
            id: undefined, name: '', status: 'Εκκρεμεί', assignedTo: '', notes: '',
            startDate: null, endDate: null, deadline: null,
            documents: '', description: '', relatedEntityIds: '',
            budgetedCost: '', actualCost: '',
        }
    });

    useEffect(() => {
        if (!projectId) {
            setIsLoadingWorkStages(false);
            return;
        };
        
        const workStagesQuery = query(collection(db, 'projects', projectId, 'workStages'), orderBy('createdAt', 'asc'));
        
        const unsubscribe = onSnapshot(workStagesQuery, async (workStagesSnapshot) => {
            const workStagesDataPromises = workStagesSnapshot.docs.map(async (doc) => {
                const workStage = { id: doc.id, ...doc.data(), workSubstages: [] } as WorkStageWithSubstages;
                const workSubstagesQuery = query(collection(db, 'projects', projectId, 'workStages', workStage.id, 'workSubstages'), orderBy('createdAt', 'asc'));
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
    }, [projectId]);

    const handleEditWorkStage = (workStage: WorkStage, parentId?: string) => {
        setEditingWorkStage(parentId ? { ...workStage, parentId } as any : workStage);
        form.reset({
            ...workStage,
            description: workStage.description || '',
            notes: workStage.notes || '',
            assignedTo: workStage.assignedTo?.[0] || '',
            documents: workStage.documents?.join(', ') || '',
            relatedEntityIds: (workStage as any).relatedEntityIds?.join(', ') || '',
            startDate: workStage.startDate?.toDate() || null,
            endDate: workStage.endDate?.toDate() || null,
            deadline: workStage.deadline?.toDate() || null,
            budgetedCost: workStage.budgetedCost?.toString() || '',
            actualCost: workStage.actualCost?.toString() || '',
        });
    };
    
    const handleAddWorkSubstage = (parentId: string) => {
        setEditingWorkStage({ parentId });
        form.reset({ status: 'Εκκρεμεί', name: '', description: '', notes: '', documents: '', assignedTo: '' });
    };

    const handleDeleteWorkStage = async (workStage: WorkStage, parentId?: string) => {
        if (!projectId) return;
        const batch = writeBatch(db);
        try {
            if (parentId) {
                // Deleting a substage
                const subStageSubRef = doc(db, 'projects', projectId, 'workStages', parentId, 'workSubstages', workStage.id);
                const subStageTopRef = doc(db, 'workSubstages', workStage.id);
                batch.delete(subStageSubRef);
                batch.delete(subStageTopRef);
            } else {
                // Deleting a main stage and all its substages
                const mainStageSubRef = doc(db, 'projects', projectId, 'workStages', workStage.id);
                const mainStageTopRef = doc(db, 'workStages', workStage.id);
                batch.delete(mainStageSubRef);
                batch.delete(mainStageTopRef);

                // Also delete its substages from both locations
                const subStagesSnapshot = await getDocs(collection(mainStageSubRef, 'workSubstages'));
                for (const subDoc of subStagesSnapshot.docs) {
                    batch.delete(subDoc.ref);
                    batch.delete(doc(db, 'workSubstages', subDoc.id));
                }
            }
          await batch.commit();
          toast({ title: 'Επιτυχία', description: 'Το Στάδιο Εργασίας διαγράφηκε.' });
          await logActivity(parentId ? 'DELETE_WORK_SUBSTAGE' : 'DELETE_WORK_STAGE', {
            entityId: workStage.id,
            entityType: parentId ? 'workSubstage' : 'workStage',
            details: { name: workStage.name, parentId: parentId },
            projectId: projectId,
          });
        } catch (error) {
          console.error("Error deleting work stage/substage:", error);
          toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Η διαγραφή απέτυχε.' });
        }
    };

    const onSubmitWorkStage = async (data: WorkStageFormValues) => {
        if (!projectId) return;
        setIsSubmitting(true);
        const batch = writeBatch(db);

        const rawData: any = {
            name: data.name, description: data.description || '', status: data.status,
            assignedTo: data.assignedTo ? [data.assignedTo] : [],
            relatedEntityIds: data.relatedEntityIds ? data.relatedEntityIds.split(',').map(s => s.trim()).filter(Boolean) : [],
            notes: data.notes || '',
            startDate: data.startDate,
            endDate: data.endDate,
            deadline: data.deadline,
            documents: data.documents ? data.documents.split(',').map(s => s.trim()).filter(Boolean) : [],
            budgetedCost: data.budgetedCost ? parseFloat(data.budgetedCost) : undefined,
            actualCost: data.actualCost ? parseFloat(data.actualCost) : undefined,
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
                const topLevelRef = parentId ? doc(db, 'workSubstages', workStageId) : doc(db, 'workStages', workStageId);
                const subRef = parentId
                    ? doc(db, 'projects', projectId, 'workStages', parentId, 'workSubstages', workStageId)
                    : doc(db, 'projects', projectId, 'workStages', workStageId);
                
                batch.update(topLevelRef, { ...finalData, assignedToId: finalData.assignedTo?.[0] || null });
                batch.update(subRef, finalData);
                
                toast({ title: 'Επιτυχία', description: 'Το Στάδιο Εργασίας ενημερώθηκε.' });
            } else {
                 const parentId = isSubstage ? (editingWorkStage as { parentId: string }).parentId : null;
                 if (isSubstage && !parentId) throw new Error("Parent ID is missing for substage creation.");

                 const subRef = parentId ? doc(collection(db, 'projects', projectId, 'workStages', parentId, 'workSubstages')) : doc(collection(db, 'projects', projectId, 'workStages'));
                 const topLevelRef = parentId ? doc(db, 'workSubstages', subRef.id) : doc(db, 'workStages', subRef.id);

                 batch.set(subRef, { ...finalData, createdAt: serverTimestamp(), checklist: [], topLevelId: topLevelRef.id });
                 batch.set(topLevelRef, { ...finalData, projectId, parentStageId: parentId, assignedToId: finalData.assignedTo?.[0] || null, createdAt: serverTimestamp(), originalId: subRef.id });
                
                toast({ title: 'Επιτυχία', description: `Το ${isSubstage ? 'υποστάδιο' : 'στάδιο'} προστέθηκε.` });
            }
            await batch.commit();
            // Manually close dialog from parent by resetting state
            setEditingWorkStage(null); 
            form.reset();

        } catch (error) {
            console.error("Error submitting work stage/substage:", error);
            toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Η υποβολή απέτυχε.' });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleChecklistItemToggle = async (stage: WorkStage, itemIndex: number, completed: boolean, isSubstage: boolean) => {
        if (!projectId) return;
        const parentId = isSubstage ? workStages.find(ws => ws.workSubstages.some(ss => ss.id === stage.id))?.id : undefined;
        if (isSubstage && !parentId) return;
        
        const docRef = parentId 
            ? doc(db, 'projects', projectId, 'workStages', parentId, 'workSubstages', stage.id)
            : doc(db, 'projects', projectId, 'workStages', stage.id);
        
        const newChecklist = [...(stage.checklist || [])];
        newChecklist[itemIndex] = { ...newChecklist[itemIndex], completed };
        
        const batch = writeBatch(db);
        batch.update(docRef, { checklist: newChecklist });
        // Also update top-level doc
        const topLevelRef = parentId ? doc(db, 'workSubstages', stage.id) : doc(db, 'workStages', stage.id);
        batch.update(topLevelRef, { checklist: newChecklist });
        await batch.commit();
    };

    const handleAddChecklistItem = async (stage: WorkStage, task: string, isSubstage: boolean) => {
        if (!projectId) return;
        const parentId = isSubstage ? workStages.find(ws => ws.workSubstages.some(ss => ss.id === stage.id))?.id : undefined;
        if (isSubstage && !parentId) return;

        const docRef = parentId
            ? doc(db, 'projects', projectId, 'workStages', parentId, 'workSubstages', stage.id)
            : doc(db, 'projects', projectId, 'workStages', stage.id);
        
        const newItem = { task, completed: false };
        
        const batch = writeBatch(db);
        batch.update(docRef, { checklist: arrayUnion(newItem) });
        const topLevelRef = parentId ? doc(db, 'workSubstages', stage.id) : doc(db, 'workStages', stage.id);
        batch.update(topLevelRef, { checklist: arrayUnion(newItem) });
        
        await batch.commit();
    };

    const handleCommentSubmit = useCallback((comment: string, files: FileList | null) => {
        // TODO: Implement file upload to Firebase Storage and add comment to Firestore
        console.log("Submitting comment:", { comment, files });
        toast({
            title: "Λειτουργία υπό κατασκευή",
            description: "Η υποβολή σχολίων δεν έχει υλοποιηθεί ακόμη."
        });
    }, [toast]);

    const handleExport = useCallback(() => {
        const flatData = workStages.flatMap(stage => {
            const baseStage = {
                level: 'Στάδιο Εργασίας',
                name: stage.name,
                status: stage.status,
                startDate: formatDate(stage.startDate),
                endDate: formatDate(stage.endDate),
                deadline: formatDate(stage.deadline),
                budgetedCost: stage.budgetedCost,
                actualCost: stage.actualCost,
                checklist: stage.checklist?.map(c => `${c.task} (${c.completed ? '✓' : '✗'})`).join('; ')
            };
            if (stage.workSubstages.length === 0) {
                return [baseStage];
            }
            const substages = stage.workSubstages.map(substage => ({
                level: 'Υποστάδιο Εργασίας',
                name: `${stage.name} > ${substage.name}`,
                status: substage.status,
                startDate: formatDate(substage.startDate),
                endDate: formatDate(substage.endDate),
                deadline: formatDate(substage.deadline),
                budgetedCost: substage.budgetedCost,
                actualCost: substage.actualCost,
                checklist: substage.checklist?.map(c => `${c.task} (${c.completed ? '✓' : '✗'})`).join('; ')
            }));
            return [baseStage, ...substages];
        });

        const fileName = `report-${projectTitle.toLowerCase().replace(/\s+/g, '-')}`;
        exportToJson(flatData, fileName);
    }, [workStages, projectTitle]);
      

    return {
        workStages,
        isLoadingWorkStages,
        isSubmitting,
        form,
        editingWorkStage,
        setEditingWorkStage,
        handleEditWorkStage,
        handleAddWorkSubstage,
        handleDeleteWorkStage,
        onSubmitWorkStage,
        handleChecklistItemToggle,
        handleAddChecklistItem,
        handleCommentSubmit,
        handleExport,
    };
}
