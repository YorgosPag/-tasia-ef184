

'use client';

import { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { collection, onSnapshot, query as firestoreQuery, doc, updateDoc, addDoc, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/shared/hooks/use-toast';
import { Button } from '@/shared/components/ui/button';
import { Loader2, PlusCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { AttachmentsListTable } from '@/tasia/components/attachments/AttachmentsListTable';
import { logActivity } from '@/shared/lib/logger';
import { getAttachmentDataFromForm } from '@/tasia/lib/unit-helpers';
import { attachmentSchema, AttachmentFormValues } from '@/tasia/components/units/AttachmentDialog';

// Re-using AttachmentDialog would require moving it to a shared location.
// For now, let's assume we might have a different dialog or form here later.

// Interfaces
export interface Attachment {
  id: string;
  type: 'parking' | 'storage';
  details: string;
  unitId?: string;
  isBundle?: boolean;
  isStandalone?: boolean;
}

export interface Unit {
  id: string;
  name: string;
  identifier: string;
}

// Data Fetching
async function fetchAttachments(): Promise<Attachment[]> {
  const q = firestoreQuery(collection(db, 'attachments'));
  return new Promise(resolve => {
    onSnapshot(q, (snapshot) => {
      resolve(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Attachment)));
    });
  });
}

async function fetchUnits(): Promise<Unit[]> {
  const q = firestoreQuery(collection(db, 'units'));
  return new Promise(resolve => {
    onSnapshot(q, (snapshot) => {
      resolve(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Unit)));
    });
  });
}

export default function AttachmentsPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingAttachment, setEditingAttachment] = useState<AttachmentFormValues | null>(null);

  const { data: attachments = [], isLoading: isLoadingAttachments } = useQuery({
    queryKey: ['attachments'],
    queryFn: fetchAttachments,
  });

  const { data: units = [], isLoading: isLoadingUnits } = useQuery({
    queryKey: ['units'],
    queryFn: fetchUnits,
  });

  const form = useForm<AttachmentFormValues>({
    resolver: zodResolver(attachmentSchema)
  });

  const unitsMap = useMemo(() => new Map(units.map(unit => [unit.id, unit])), [units]);

  const onEdit = (attachment: Attachment) => {
    setEditingAttachment(attachment as AttachmentFormValues);
    form.reset(attachment as AttachmentFormValues);
    // Here you would open a dialog/modal
    toast({ title: "Επεξεργασία (Δεν έχει υλοποιηθεί)", description: `Επιλέχθηκε το παρακολούθημα: ${attachment.details}` });
  };
  
  // Placeholder for submission logic
  const onSubmit = async (data: AttachmentFormValues) => {
      setIsSubmitting(true);
      const finalData = getAttachmentDataFromForm(data);
       try {
        if (editingAttachment?.id) {
            await updateDoc(doc(db, 'attachments', editingAttachment.id), finalData);
            toast({ title: 'Επιτυχία', description: 'Το παρακολούθημα ενημερώθηκε.' });
            await logActivity('UPDATE_ATTACHMENT', { entityId: editingAttachment.id, entityType: 'attachment', changes: finalData });
        } else {
            // Logic for creating a new standalone attachment
            const docRef = await addDoc(collection(db, 'attachments'), { ...finalData, createdAt: serverTimestamp(), isStandalone: true });
            toast({ title: 'Επιτυχία', description: 'Το ανεξάρτητο παρακολούθημα δημιουργήθηκε.' });
            await logActivity('CREATE_ATTACHMENT', { entityId: docRef.id, entityType: 'attachment', details: finalData });
        }
        // Close dialog logic here
      } catch (error: any) {
         toast({ variant: 'destructive', title: 'Σφάλμα', description: `Η αποθήκευση απέτυχε: ${error.message}` });
      } finally {
        setIsSubmitting(false);
      }
  };


  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Παρακολουθήματα
        </h1>
         <Button onClick={() => alert("Form for new standalone attachment needed.")}>
            <PlusCircle className="mr-2" />
            Νέο Ανεξάρτητο Παρακολούθημα
          </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Λίστα Παρακολουθημάτων</CardTitle>
          <CardDescription>
            Επισκόπηση όλων των θέσεων στάθμευσης, αποθηκών, κ.λπ. σε όλα τα έργα.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingAttachments || isLoadingUnits ? (
             <div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
          ) : (
            <AttachmentsListTable 
              attachments={attachments} 
              unitsMap={unitsMap} 
              onEdit={onEdit} 
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
