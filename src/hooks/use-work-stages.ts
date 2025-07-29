

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
import { db, storage } from '@/shared/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/shared/hooks/use-toast';
import { logActivity } from '@/shared/lib/logger';
import { WorkStageFormValues, workStageSchema } from '@/components/projects/work-stages/workStageSchema';
import type { WorkStage, WorkStageWithSubstages } from '@/shared/types/project-types';
import { exportToJson } from '@/shared/lib/exporter';
import { formatDate } from '@/components/projects/work-stages/utils';
import { useAuth } from '@/shared/hooks/use-auth';

// --- Internal Hooks for Logic Separation ---

function useWorkStageData(projectId: string) {
    const [workStages, setWorkStages] = useState<WorkStageWithSubstages[]>([]);
    const [isLoadingWorkStages, setIsLoadingWorkStages] = useState(true);

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

    return { workStages, setWorkStages, isLoadingWorkStages };
}

function useWorkStageForm(projectId: string) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingWorkStage, setEditingWorkStage] = useState<WorkStage | { parentId: string } | null>(null);
    const { toast } = useToast();

    const form = useForm<WorkStageFormValues>({
        resolver: zodResolver(workStageSchema),
        defaultValues: {
            id: undefined, name: '', status: 'Εκκρεμεί', assignedTo: '', notes: '',
            startDate: null, endDate: null, deadline: null,
            documents: '', description: '', relatedEntityIds: '', dependsOn: '',
            budgetedCost: '', actualCost: '',
        }
    });

    const handleEditWorkStage = (workStage: WorkStage, parentId?: string) => {
        setEditingWorkStage(parentId ? { ...workStage, parentId } as any : workStage);
        form.reset({
            ...workStage,
            description: workStage.description || '', notes: workStage.notes || '',
            assignedTo: workStage.assignedTo?.[0] || '', documents: workStage.documents?.join('\\n') || '',
            relatedEntityIds: (workStage as any).relatedEntityIds?.join(', ') || '',
            dependsOn: workStage.dependsOn?.join(', ') || '',
            startDate: workStage.startDate?.toDate() || null, endDate: workStage.endDate?.toDate() || null,
            deadline: workStage.deadline?.toDate() || null,
            budgetedCost: workStage.budgetedCost?.toString() || '', actualCost: workStage.actualCost?.toString() || '',
        });
    };
    
    const handleAddWorkSubstage = (parentId: string) => {
        setEditingWorkStage({ parentId });
        form.reset({ status: 'Εκκρεμεί', name: '', description: '', notes: '', documents: '', assignedTo: '' });
    };

    const onSubmitWorkStage = async (data: WorkStageFormValues) => {
        if (!projectId) return;
        setIsSubmitting(true);
        const batch = writeBatch(db);

        const rawData: any = {
            name: data.name, description: data.description || '', status: data.status,
            assignedTo: data.assignedTo ? [data.assignedTo] : [],
            relatedEntityIds: data.relatedEntityIds ? data.relatedEntityIds.split(',').map(s => s.trim()).filter(Boolean) : [],
            dependsOn: data.dependsOn ? data.dependsOn.split(',').map(s => s.trim()).filter(Boolean) : [],
            notes: data.notes || '', startDate: data.startDate, endDate: data.endDate, deadline: data.deadline,
            documents: data.documents ? data.documents.split('\\n').map(s => s.trim()).filter(Boolean) : [],
            budgetedCost: data.budgetedCost ? parseFloat(data.budgetedCost) : undefined,
            actualCost: data.actualCost ? parseFloat(data.actualCost) : undefined,
        };
        
        const finalData = Object.fromEntries(Object.entries(rawData).filter(([_, v]) => v !== undefined && v !== null && v !== ''));
        
        if (finalData.startDate) finalData.startDate = Timestamp.fromDate(finalData.startDate as Date);
        if (finalData.endDate) finalData.endDate = Timestamp.fromDate(finalData.endDate as Date);
        if (finalData.deadline) finalData.deadline = Timestamp.fromDate(finalData.deadline as Date);

        if (finalData.documents && Array.isArray(finalData.documents)) {
            const documentTasks = finalData.documents.map((docName: string) => ({ task: docName, completed: false, }));
            const existingChecklist = editingWorkStage && 'checklist' in editingWorkStage ? (editingWorkStage.checklist || []) : [];
            const existingDocumentTasks = existingChecklist.filter(item => finalData.documents.includes(item.task));
            const newDocumentTasks = documentTasks.filter(item => !existingChecklist.some(ex => ex.task === item.task));
            const otherTasks = existingChecklist.filter(item => !finalData.documents.includes(item.task) && !item.task.startsWith('Doc:'));
            finalData.checklist = [...otherTasks, ...existingDocumentTasks, ...newDocumentTasks];
        }

        try {
            const isSubstage = editingWorkStage && 'parentId' in editingWorkStage;
            const isEditing = editingWorkStage && 'id' in editingWorkStage;

            if (isEditing) {
                const parentId = (editingWorkStage as any).parentId;
                const workStageId = (editingWorkStage as WorkStage).id;
                const topLevelId = (editingWorkStage as any).topLevelId;
                if (!topLevelId) throw new Error("topLevelId is missing for editing.");
                const topLevelRef = parentId ? doc(db, 'workSubstages', topLevelId) : doc(db, 'workStages', topLevelId);
                const subRef = parentId ? doc(db, 'projects', projectId, 'workStages', parentId, 'workSubstages', workStageId) : doc(db, 'projects', projectId, 'workStages', workStageId);
                batch.update(topLevelRef, { ...finalData, assignedToId: finalData.assignedTo?.[0] || null });
                batch.update(subRef, finalData);
                toast({ title: 'Επιτυχία', description: 'Το Στάδιο Εργασίας ενημερώθηκε.' });
            } else {
                 const parentId = isSubstage ? (editingWorkStage as { parentId: string }).parentId : null;
                 if (isSubstage && !parentId) throw new Error("Parent ID is missing for substage creation.");
                 const topLevelRef = parentId ? doc(collection(db, 'workSubstages')) : doc(collection(db, 'workStages'));
                 const subRef = doc(collection(db, 'projects', projectId, parentId ? `workStages/${parentId}/workSubstages` : 'workStages'));
                 batch.set(subRef, { ...finalData, createdAt: serverTimestamp(), inspections: [], photos: [], comments: [], topLevelId: topLevelRef.id });
                 batch.set(topLevelRef, { ...finalData, projectId, parentStageId: parentId, assignedToId: finalData.assignedTo?.[0] || null, createdAt: serverTimestamp(), originalId: subRef.id });
                 toast({ title: 'Επιτυχία', description: `Το ${isSubstage ? 'υποστάδιο' : 'στάδιο'} προστέθηκε.` });
            }
            await batch.commit();
            setEditingWorkStage(null); 
            form.reset();
        } catch (error) {
            console.error("Error submitting work stage/substage:", error);
            toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Η υποβολή απέτυχε.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return { form, isSubmitting, editingWorkStage, setEditingWorkStage, handleEditWorkStage, handleAddWorkSubstage, onSubmitWorkStage };
}

function useWorkStageActions(projectId: string, projectTitle: string, workStages: WorkStageWithSubstages[]) {
    const { toast } = useToast();

    const handleDeleteWorkStage = async (workStage: WorkStage, parentId?: string) => {
        if (!projectId) return;
        const batch = writeBatch(db);
        try {
            if (parentId) {
                const subStageSubRef = doc(db, 'projects', projectId, 'workStages', parentId, 'workSubstages', workStage.id);
                const subStageTopRef = doc(db, 'workSubstages', (workStage as any).topLevelId);
                batch.delete(subStageSubRef);
                batch.delete(subStageTopRef);
            } else {
                const mainStageSubRef = doc(db, 'projects', projectId, 'workStages', workStage.id);
                const mainStageTopRef = doc(db, 'workStages', (workStage as any).topLevelId);
                batch.delete(mainStageSubRef);
                batch.delete(mainStageTopRef);
                const subStagesSnapshot = await getDocs(collection(mainStageSubRef, 'workSubstages'));
                for (const subDoc of subStagesSnapshot.docs) {
                    batch.delete(subDoc.ref);
                    const topLevelId = subDoc.data().topLevelId;
                    if (topLevelId) batch.delete(doc(db, 'workSubstages', topLevelId));
                }
            }
            await batch.commit();
            toast({ title: 'Επιτυχία', description: 'Το Στάδιο Εργασίας διαγράφηκε.' });
            await logActivity(parentId ? 'DELETE_WORK_SUBSTAGE' : 'DELETE_WORK_STAGE', {
                entityId: workStage.id, entityType: parentId ? 'workSubstage' : 'workStage',
                details: { name: workStage.name, parentId: parentId }, projectId: projectId,
            });
        } catch (error) {
            console.error("Error deleting work stage/substage:", error);
            toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Η διαγραφή απέτυχε.' });
        }
    };

    const handleExport = useCallback(() => {
        const flatData = workStages.flatMap(stage => {
            const baseStage = {
                level: 'Στάδιο Εργασίας', name: stage.name, status: stage.status,
                startDate: formatDate(stage.startDate), endDate: formatDate(stage.endDate), deadline: formatDate(stage.deadline),
                budgetedCost: stage.budgetedCost, actualCost: stage.actualCost,
            };
            if (stage.workSubstages.length === 0) return [baseStage];
            const substages = stage.workSubstages.map(substage => ({
                level: 'Υποστάδιο Εργασίας', name: `${stage.name} > ${substage.name}`, status: substage.status,
                startDate: formatDate(substage.startDate), endDate: formatDate(substage.endDate), deadline: formatDate(substage.deadline),
                budgetedCost: substage.budgetedCost, actualCost: substage.actualCost,
            }));
            return [baseStage, ...substages];
        });
        const fileName = `report-${projectTitle.toLowerCase().replace(/\s+/g, '-')}`;
        exportToJson(flatData, fileName);
    }, [workStages, projectTitle]);

    return { handleDeleteWorkStage, handleExport };
}

function useWorkStageChecklist(projectId: string, workStages: WorkStageWithSubstages[]) {
    const { user } = useAuth();
    const { toast } = useToast();

    const handleChecklistItemToggle = async (stage: WorkStage, itemIndex: number, completed: boolean, isSubstage: boolean) => {
        if (!projectId || !user) return;
        const parentId = isSubstage ? workStages.find(ws => ws.workSubstages.some(ss => ss.id === stage.id))?.id : undefined;
        if (isSubstage && !parentId) return;
        const docRef = parentId ? doc(db, 'projects', projectId, 'workStages', parentId, 'workSubstages', stage.id) : doc(db, 'projects', projectId, 'workStages', stage.id);
        const newChecklist = [...(stage.checklist || [])];
        const updatedItem = { ...newChecklist[itemIndex], completed, completionDate: completed ? serverTimestamp() : undefined, completedBy: completed ? user.email : undefined };
        newChecklist[itemIndex] = updatedItem;
        const batch = writeBatch(db);
        batch.update(docRef, { checklist: newChecklist });
        const topLevelId = (stage as any).topLevelId;
        if (topLevelId) {
            const topLevelRef = parentId ? doc(db, 'workSubstages', topLevelId) : doc(db, 'workStages', topLevelId);
            batch.update(topLevelRef, { checklist: newChecklist });
        }
        await batch.commit();
    };

    const handleAddChecklistItem = async (stage: WorkStage, task: string, isSubstage: boolean) => {
        if (!projectId) return;
        const parentId = isSubstage ? workStages.find(ws => ws.workSubstages.some(ss => ss.id === stage.id))?.id : undefined;
        if (isSubstage && !parentId) return;
        const docRef = parentId ? doc(db, 'projects', projectId, 'workStages', parentId, 'workSubstages', stage.id) : doc(db, 'projects', projectId, 'workStages', stage.id);
        const newItem = { task, completed: false };
        const batch = writeBatch(db);
        batch.update(docRef, { checklist: arrayUnion(newItem) });
        const topLevelId = (stage as any).topLevelId;
        if (topLevelId) {
            const topLevelRef = parentId ? doc(db, 'workSubstages', topLevelId) : doc(db, 'workStages', topLevelId);
            batch.update(topLevelRef, { checklist: arrayUnion(newItem) });
        }
        await batch.commit();
    };
    
    const handleInspectionNotesChange = async (stage: WorkStage, itemIndex: number, notes: string, isSubstage: boolean) => {
        if (!projectId) return;
        const parentId = isSubstage ? workStages.find(ws => ws.workSubstages.some(ss => ss.id === stage.id))?.id : undefined;
        if (isSubstage && !parentId) return;
        const docRef = parentId ? doc(db, 'projects', projectId, 'workStages', parentId, 'workSubstages', stage.id) : doc(db, 'projects', projectId, 'workStages', stage.id);
        const newChecklist = [...(stage.checklist || [])];
        if (newChecklist[itemIndex]) newChecklist[itemIndex].inspectionNotes = notes;
        const batch = writeBatch(db);
        batch.update(docRef, { checklist: newChecklist });
        const topLevelId = (stage as any).topLevelId;
        if (topLevelId) {
            const topLevelRef = parentId ? doc(db, 'workSubstages', topLevelId) : doc(db, 'workStages', topLevelId);
            batch.update(topLevelRef, { checklist: newChecklist });
        }
        await batch.commit();
        toast({ title: "Οι παρατηρήσεις αποθηκεύτηκαν." });
    };

    return { handleChecklistItemToggle, handleAddChecklistItem, handleInspectionNotesChange };
}

function useWorkStageExtras(projectId: string, workStages: WorkStageWithSubstages[]) {
    const { user } = useAuth();
    const { toast } = useToast();

    const handlePhotoUpload = async (stage: WorkStage, files: FileList, isSubstage: boolean) => {
        if (!files.length || !user || !projectId) return;
        const parentId = isSubstage ? workStages.find(ws => ws.workSubstages.some(ss => ss.id === stage.id))?.id : undefined;
        if (isSubstage && !parentId) return;
        const docRef = parentId ? doc(db, 'projects', projectId, 'workStages', parentId, 'workSubstages', stage.id) : doc(db, 'projects', projectId, 'workStages', stage.id);
        toast({ title: "Ανέβασμα...", description: `Ανέβασμα ${files.length} φωτογραφιών...` });
        try {
            const photoUploadPromises = Array.from(files).map(async (file) => {
                const photoRef = ref(storage, `work_stages_photos/${projectId}/${stage.id}/${file.name}`);
                await uploadBytes(photoRef, file);
                const url = await getDownloadURL(photoRef);
                return { url, uploadedAt: Timestamp.now(), uploadedBy: user.email || user.uid };
            });
            const newPhotos = await Promise.all(photoUploadPromises);
            const batch = writeBatch(db);
            batch.update(docRef, { photos: arrayUnion(...newPhotos) });
            const topLevelId = (stage as any).topLevelId;
            if (topLevelId) {
                const topLevelRef = parentId ? doc(db, 'workSubstages', topLevelId) : doc(db, 'workStages', topLevelId);
                batch.update(topLevelRef, { photos: arrayUnion(...newPhotos) });
            }
            await batch.commit();
            toast({ title: "Επιτυχία", description: "Οι φωτογραφίες ανέβηκαν επιτυχώς." });
        } catch (error) {
            console.error("Photo upload failed:", error);
            toast({ variant: 'destructive', title: "Σφάλμα", description: "Το ανέβασμα των φωτογραφιών απέτυχε." });
        }
    };
    
    const handleCommentSubmit = async (stage: WorkStage, comment: string, isSubstage: boolean) => {
        if (!projectId || !user?.email) return;
        const parentId = isSubstage ? workStages.find(ws => ws.workSubstages.some(ss => ss.id === stage.id))?.id : undefined;
        if (isSubstage && !parentId) return;
        const docRef = parentId ? doc(db, 'projects', projectId, 'workStages', parentId, 'workSubstages', stage.id) : doc(db, 'projects', projectId, 'workStages', stage.id);
        const newComment = { id: doc(collection(db, 'dummy')).id, text: comment, authorId: user.uid, authorEmail: user.email, createdAt: Timestamp.now(), type: user.photoURL === 'client' ? 'client' : 'internal' };
        const batch = writeBatch(db);
        batch.update(docRef, { comments: arrayUnion(newComment) });
        const topLevelId = (stage as any).topLevelId;
        if (topLevelId) {
            const topLevelRef = parentId ? doc(db, 'workSubstages', topLevelId) : doc(db, 'workStages', topLevelId);
            batch.update(topLevelRef, { comments: arrayUnion(newComment) });
        }
        await batch.commit();
    };

    return { handlePhotoUpload, handleCommentSubmit };
}


// --- Main Hook (Orchestrator) ---

export function useWorkStages(projectId: string, projectTitle: string) {
    const { workStages, isLoadingWorkStages } = useWorkStageData(projectId);
    const { form, isSubmitting, editingWorkStage, setEditingWorkStage, handleEditWorkStage, handleAddWorkSubstage, onSubmitWorkStage } = useWorkStageForm(projectId);
    const { handleDeleteWorkStage, handleExport } = useWorkStageActions(projectId, projectTitle, workStages);
    const { handleChecklistItemToggle, handleAddChecklistItem, handleInspectionNotesChange } = useWorkStageChecklist(projectId, workStages);
    const { handlePhotoUpload, handleCommentSubmit } = useWorkStageExtras(projectId, workStages);

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
        handleInspectionNotesChange,
        handlePhotoUpload,
        handleCommentSubmit,
        handleExport,
    };
}
