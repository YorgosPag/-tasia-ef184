
'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, updateDoc, doc, addDoc, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Loader2, PlusCircle, Search } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { AttachmentFormValues, AttachmentDialog, attachmentSchema } from '@/components/units/AttachmentDialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getAttachmentDataFromForm } from '@/lib/unit-helpers';
import { logActivity } from '@/lib/logger';
import { AttachmentsListTable } from '@/components/attachments/AttachmentsListTable';
import type { Attachment, Unit } from '@/lib/types/attachments';


export default function AttachmentsPage() {
  const { isEditor } = useAuth();
  const { toast } = useToast();
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAttachment, setEditingAttachment] = useState<Attachment | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const unitsMap = new Map(units.map(u => [u.id, u]));

  const form = useForm<AttachmentFormValues>({
    resolver: zodResolver(attachmentSchema),
    defaultValues: {
      type: 'parking', identifier: '', details: '', area: '', price: '', sharePercentage: '', isBundle: true, isStandalone: false
    }
  });

   useEffect(() => {
        const unsubscribeAttachments = onSnapshot(query(collection(db, 'attachments')), (snapshot) => {
            setAttachments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Attachment)));
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching attachments:", error);
            toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Failed to load attachments.' });
            setIsLoading(false);
        });

        const unsubscribeUnits = onSnapshot(query(collection(db, 'units')), (snapshot) => {
            setUnits(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Unit)));
        }, (error) => {
            console.error("Error fetching units:", error);
        });

        return () => {
            unsubscribeAttachments();
            unsubscribeUnits();
        }
    }, [toast]);

  const handleOpenDialog = (attachment: Attachment | null = null) => {
    setEditingAttachment(attachment);
    if (attachment) {
      form.reset(attachment);
    } else {
      form.reset({
        type: 'parking', identifier: '', details: '', area: '', price: '', sharePercentage: '', isBundle: true, isStandalone: false
      });
    }
    setIsDialogOpen(true);
  };
  
  const onSubmit = async (data: AttachmentFormValues) => {
      setIsSubmitting(true);
      const finalData = getAttachmentDataFromForm(data);

      try {
          if(editingAttachment) {
              await updateDoc(doc(db, 'attachments', editingAttachment.id), finalData);
              toast({title: 'Επιτυχία', description: 'Το παρακολούθημα ενημερώθηκε.'});
          } else {
             // Note: Standalone attachments cannot be created from this page.
             // They must be associated with a unit, which is not selected here.
             toast({variant: 'destructive', title: 'Σφάλμα', description: 'Δεν είναι δυνατή η δημιουργία αυτόνομου παρακολουθήματος από εδώ.'});
          }
          setIsDialogOpen(false);
      } catch (error) {
          console.error('Failed to save attachment', error);
          toast({variant: 'destructive', title: 'Σφάλμα', description: 'Η αποθήκευση απέτυχε.'});
      } finally {
          setIsSubmitting(false);
      }
  }


  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold tracking-tight">Παρακολουθήματα</h1>
       <Card>
        <CardHeader>
          <CardTitle>Λίστα Παρακολουθημάτων ({attachments.length})</CardTitle>
        </CardHeader>
        <CardContent>
           {isLoading ? (
            <div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
          ) : (
            <AttachmentsListTable attachments={attachments} unitsMap={unitsMap} onEdit={handleOpenDialog} />
          )}
        </CardContent>
      </Card>
      
       <AttachmentDialog 
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            form={form}
            onSubmit={form.handleSubmit(onSubmit)}
            isSubmitting={isSubmitting}
            editingAttachment={editingAttachment}
       />
    </div>
  );
}
