
'use client';

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
import { Button } from '@/components/ui/button';
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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PlusCircle, Loader2, Edit, Trash2, GitMerge } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { logActivity } from '@/lib/logger';
import { Company } from '@/hooks/use-data-store';
import { PhaseFormDialog } from './PhaseFormDialog';
import type { Project, Phase, PhaseWithSubphases } from '@/app/projects/[id]/page';

// Schema for the phase form
const phaseSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, 'Το όνομα είναι υποχρεωτικό.'),
    description: z.string().optional(),
    status: z.enum(['Εκκρεμεί', 'Σε εξέλιξη', 'Ολοκληρώθηκε', 'Καθυστερεί']),
    assignedTo: z.string().optional(),
    notes: z.string().optional(),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    deadline: z.date().optional(),
    documents: z.string().optional(), // URLs separated by comma
});

export type PhaseFormValues = z.infer<typeof phaseSchema>;


interface PhasesSectionProps {
    project: Project;
    companies: Company[];
    isLoadingCompanies: boolean;
}

export function PhasesSection({ project, companies, isLoadingCompanies }: PhasesSectionProps) {
    const { toast } = useToast();
    const [phases, setPhases] = useState<PhaseWithSubphases[]>([]);
    const [isLoadingPhases, setIsLoadingPhases] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isPhaseDialogOpen, setIsPhaseDialogOpen] = useState(false);
    const [editingPhase, setEditingPhase] = useState<Phase | { parentId: string } | null>(null);

    const form = useForm<PhaseFormValues>({
        resolver: zodResolver(phaseSchema),
        defaultValues: {
            id: undefined, name: '', status: 'Εκκρεμεί', assignedTo: '', notes: '',
            startDate: undefined, endDate: undefined, deadline: undefined,
            documents: '', description: '',
        }
    });

    useEffect(() => {
        if (!project.id) return;
        const phasesQuery = query(collection(db, 'projects', project.id, 'phases'), orderBy('createdAt', 'asc'));
        
        const unsubscribe = onSnapshot(phasesQuery, async (phasesSnapshot) => {
            const phasesDataPromises = phasesSnapshot.docs.map(async (phaseDoc) => {
                const phase = { id: phaseDoc.id, ...phaseDoc.data() } as Phase;
                
                const subphasesQuery = query(collection(db, 'projects', project.id, 'phases', phase.id, 'subphases'), orderBy('createdAt', 'asc'));
                const subphasesSnapshot = await getDocs(subphasesQuery);
                const subphases = subphasesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Phase));

                return { ...phase, subphases };
            });

            const phasesWithSubphases = await Promise.all(phasesDataPromises);
            setPhases(phasesWithSubphases);
            setIsLoadingPhases(false);
        },
        (error) => {
            console.error("Error fetching phases:", error);
            setIsLoadingPhases(false);
        });

        return () => unsubscribe();
    }, [project.id]);

    const handlePhaseDialogOpenChange = (open: boolean) => {
        setIsPhaseDialogOpen(open);
        if(!open) {
            form.reset();
            setEditingPhase(null);
        }
    };

    const handleEditPhase = (phase: Phase, parentId?: string) => {
        setEditingPhase(parentId ? { ...phase, parentId } as any : phase);
        form.reset({
            ...phase,
            assignedTo: phase.assignedTo,
            documents: phase.documents?.join(', '),
            startDate: phase.startDate?.toDate(),
            endDate: phase.endDate?.toDate(),
            deadline: phase.deadline?.toDate(),
        });
        setIsPhaseDialogOpen(true);
    }
    
    const handleAddSubphase = (parentId: string) => {
        setEditingPhase({ parentId });
        form.reset({ status: 'Εκκρεμεί' });
        setIsPhaseDialogOpen(true);
    };

    const handleDeletePhase = async (phase: Phase, parentId?: string) => {
        if (!project.id) return;
        try {
          const docPath = parentId
            ? doc(db, 'projects', project.id, 'phases', parentId, 'subphases', phase.id)
            : doc(db, 'projects', project.id, 'phases', phase.id);
          await deleteDoc(docPath);
          toast({ title: 'Επιτυχία', description: 'Η εγγραφή διαγράφηκε.' });
          await logActivity(parentId ? 'DELETE_SUBPHASE' : 'DELETE_PHASE', {
            entityId: phase.id,
            entityType: parentId ? 'subphase' : 'phase',
            details: { name: phase.name, parentId: parentId },
          });
        } catch (error) {
          console.error("Error deleting phase/subphase:", error);
          toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Η διαγραφή απέτυχε.' });
        }
      }

    const onSubmitPhase = async (data: PhaseFormValues) => {
        if (!project.id) return;
        setIsSubmitting(true);

        const finalData = {
            name: data.name, description: data.description || '', status: data.status,
            assignedTo: data.assignedTo === 'none' ? undefined : data.assignedTo,
            notes: data.notes || '', startDate: data.startDate ? Timestamp.fromDate(data.startDate) : undefined,
            endDate: data.endDate ? Timestamp.fromDate(data.endDate) : undefined,
            deadline: data.deadline ? Timestamp.fromDate(data.deadline) : undefined,
            documents: data.documents ? data.documents.split(',').map(s => s.trim()).filter(Boolean) : [],
        };
        
        try {
            const isSubphase = editingPhase && 'parentId' in editingPhase;
            const isEditing = editingPhase && 'id' in editingPhase;

            if (isEditing) {
                const parentId = (editingPhase as any).parentId;
                const phaseId = (editingPhase as Phase).id;
                const docRef = parentId
                    ? doc(db, 'projects', project.id, 'phases', parentId, 'subphases', phaseId)
                    : doc(db, 'projects', project.id, 'phases', phaseId);
                await updateDoc(docRef, finalData);
                toast({ title: 'Επιτυχία', description: 'Η εγγραφή ενημερώθηκε.' });
                await logActivity(isSubphase ? 'UPDATE_SUBPHASE' : 'UPDATE_PHASE', {
                    entityId: phaseId,
                    entityType: isSubphase ? 'subphase' : 'phase',
                    changes: finalData,
                });

            } else {
                 const parentId = isSubphase ? (editingPhase as { parentId: string }).parentId : null;
                 const collectionPath = parentId
                    ? collection(db, 'projects', project.id, 'phases', parentId, 'subphases')
                    : collection(db, 'projects', project.id, 'phases');
                const newDocRef = await addDoc(collectionPath, { ...finalData, createdAt: serverTimestamp() });
                toast({ title: 'Επιτυχία', description: `Η ${isSubphase ? 'υποφάση' : 'φάση'} προστέθηκε.` });
                await logActivity(isSubphase ? 'CREATE_SUBPHASE' : 'CREATE_PHASE', {
                    entityId: newDocRef.id,
                    entityType: isSubphase ? 'subphase' : 'phase',
                    details: finalData,
                });
            }
            handlePhaseDialogOpenChange(false);
        } catch (error) {
            console.error("Error submitting phase/subphase:", error);
            toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Η υποβολή απέτυχε.' });
        } finally {
            setIsSubmitting(false);
        }
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
      }
    
      const getCompanyName = (companyId?: string) => {
        if (!companyId) return '-';
        return companies.find(c => c.id === companyId)?.name || 'Άγνωστη εταιρεία';
      }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Φάσεις Κατασκευής</CardTitle>
                    <Button size="sm" onClick={() => setIsPhaseDialogOpen(true)}><PlusCircle className="mr-2"/>Νέα Φάση</Button>
                </div>
            </CardHeader>
            <CardContent>
                {isLoadingPhases ? (<div className="flex justify-center items-center h-24"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>)
                : phases.length > 0 ? (
                    <div className="w-full overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow><TableHead>Φάση / Υποφάση</TableHead><TableHead>Κατάσταση</TableHead><TableHead>Υπεύθυνος</TableHead><TableHead>Έναρξη</TableHead><TableHead>Λήξη</TableHead><TableHead>Προθεσμία</TableHead><TableHead className="text-right">Ενέργειες</TableHead></TableRow>
                            </TableHeader>
                            <TableBody>
                                {phases.map(phase => (
                                    <React.Fragment key={phase.id}>
                                    <TableRow className="group bg-muted/20">
                                        <TableCell className="font-bold">{phase.name}</TableCell>
                                        <TableCell><Badge variant={getStatusVariant(phase.status)}>{phase.status}</Badge></TableCell>
                                        <TableCell>{getCompanyName(phase.assignedTo)}</TableCell>
                                        <TableCell>{formatDate(phase.startDate)}</TableCell>
                                        <TableCell>{formatDate(phase.endDate)}</TableCell>
                                        <TableCell>{formatDate(phase.deadline)}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-end gap-1">
                                                <Button variant="ghost" size="icon" title="Προσθήκη Υποφάσης" onClick={() => handleAddSubphase(phase.id)}><GitMerge className="h-4 w-4" /><span className="sr-only">Προσθήκη Υποφάσης</span></Button>
                                                <Button variant="ghost" size="icon" title="Επεξεργασία Φάσης" onClick={() => handleEditPhase(phase)}><Edit className="h-4 w-4"/><span className="sr-only">Επεξεργασία Φάσης</span></Button>
                                                <AlertDialog><AlertDialogTrigger asChild><Button variant="ghost" size="icon" title="Διαγραφή Φάσης" className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4"/><span className="sr-only">Διαγραφή Φάσης</span></Button></AlertDialogTrigger>
                                                    <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Είστε σίγουροι;</AlertDialogTitle><AlertDialogDescription>Αυτή η ενέργεια θα διαγράψει οριστικά τη φάση "{phase.name}" και όλες τις υποφάσεις της.</AlertDialogDescription></AlertDialogHeader>
                                                        <AlertDialogFooter><AlertDialogCancel>Ακύρωση</AlertDialogCancel><AlertDialogAction onClick={() => handleDeletePhase(phase)} className="bg-destructive hover:bg-destructive/90">Διαγραφή</AlertDialogAction></AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    {phase.subphases.map(subphase => (
                                        <TableRow key={subphase.id} className="group">
                                            <TableCell className="pl-8 text-muted-foreground"><span className="mr-2">└</span> {subphase.name}</TableCell>
                                            <TableCell><Badge variant={getStatusVariant(subphase.status)}>{subphase.status}</Badge></TableCell>
                                            <TableCell>{getCompanyName(subphase.assignedTo)}</TableCell>
                                            <TableCell>{formatDate(subphase.startDate)}</TableCell>
                                            <TableCell>{formatDate(subphase.endDate)}</TableCell>
                                            <TableCell>{formatDate(subphase.deadline)}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" title="Επεξεργασία Υποφάσης" onClick={() => handleEditPhase(subphase, phase.id)}><Edit className="h-4 w-4"/><span className="sr-only">Επεξεργασία Υποφάσης</span></Button>
                                                    <AlertDialog><AlertDialogTrigger asChild><Button variant="ghost" size="icon" title="Διαγραφή Υποφάσης" className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4"/><span className="sr-only">Διαγραφή Υποφάσης</span></Button></AlertDialogTrigger>
                                                        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Είστε σίγουροι;</AlertDialogTitle><AlertDialogDescription>Αυτή η ενέργεια θα διαγράψει οριστικά την υποφάση "{subphase.name}".</AlertDialogDescription></AlertDialogHeader>
                                                            <AlertDialogFooter><AlertDialogCancel>Ακύρωση</AlertDialogCancel><AlertDialogAction onClick={() => handleDeletePhase(subphase, phase.id)} className="bg-destructive hover:bg-destructive/90">Διαγραφή</AlertDialogAction></AlertDialogFooter>
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
                ) : (<p className="text-center text-muted-foreground py-8">Δεν υπάρχουν καταχωρημένες φάσεις για αυτό το έργο.</p>)}
            </CardContent>
            <PhaseFormDialog 
                open={isPhaseDialogOpen}
                onOpenChange={handlePhaseDialogOpenChange}
                form={form}
                onSubmit={form.handleSubmit(onSubmitPhase)}
                isSubmitting={isSubmitting}
                editingPhase={editingPhase}
                companies={companies}
                isLoadingCompanies={isLoadingCompanies}
            />
        </Card>
    );
}
