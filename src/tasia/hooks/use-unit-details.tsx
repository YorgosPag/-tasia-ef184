

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  doc,
  getDoc,
  collection,
  onSnapshot,
  Timestamp,
  query,
  where,
  deleteDoc,
  addDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { logActivity } from '@/lib/logger';
import { newUnitSchema as unitSchema, getUnitDataFromForm, getAttachmentDataFromForm, getStatusClass } from '../lib/unit-helpers';
import type { NewUnitFormValues as UnitFormValues } from '../lib/unit-helpers';
import { AttachmentFormValues, attachmentSchema } from '../components/units/AttachmentDialog';
import type { UnitContract } from '../components/units/tabs/UnitContractsTab';

export interface Unit {
  id: string;
  identifier: string;
  name: string;
  type?: string;
  status: 'Διαθέσιμο' | 'Κρατημένο' | 'Πωλημένο' | 'Οικοπεδούχος' | 'Προς Ενοικίαση';
  buildingId: string;
  floorIds: string[];
  originalId: string;
  createdAt: Timestamp;
  projectId?: string;
  levelSpan?: number;
  
  netArea?: number;
  grossArea?: number;
  commonArea?: number;
  semiOutdoorArea?: number;
  architecturalProjectionsArea?: number;
  balconiesArea?: number;
  
  price?: number;
  bedrooms?: number;
  bathrooms?: string;
  orientation?: string;
  kitchenLayout?: string;
  amenities?: string[];
  description?: string;
  isPenthouse?: boolean;

  contracts?: UnitContract[];
  photos?: { url: string; name: string; uploadedAt: Timestamp }[];
  floorPlans?: Record<string, {
      applicationUrl?: string;
      urbanPlanningUrl?: string;
  }>;
}

export function useUnitDetails() {
  const params = useParams();
  const router = useRouter();
  const unitId = params.id as string;
  const { toast } = useToast();

  const [unit, setUnit] = useState<Unit | null>(null);
  const [attachments, setAttachments] = useState<AttachmentFormValues[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingAttachment, setEditingAttachment] = useState<AttachmentFormValues | null>(null);
  const [isAttachmentDialogOpen, setIsAttachmentDialogOpen] = useState(false);

  const unitForm = useForm<UnitFormValues>({
    resolver: zodResolver(unitSchema),
    defaultValues: {
      identifier: '', name: '', type: '', status: 'Διαθέσιμο', floorIds: [],
      netArea: '', grossArea: '', commonArea: '', semiOutdoorArea: '', architecturalProjectionsArea: '', balconiesArea: '',
      price: '', bedrooms: '', bathrooms: '', orientation: '', kitchenLayout: '',
      description: '', isPenthouse: false, amenities: [], levelSpan: 1,
    },
  });

  const attachmentForm = useForm<AttachmentFormValues>({
    resolver: zodResolver(attachmentSchema),
    defaultValues: {
      type: 'parking', identifier: '', details: '', area: '', price: '', sharePercentage: '', isBundle: true, isStandalone: false
    }
  });

  useEffect(() => {
    if (!unitId) return;
    
    const unitDocRef = doc(db, 'units', unitId);
    const unsubscribeUnit = onSnapshot(unitDocRef, (unitDocSnap) => {
        setIsLoading(true);
        if (!unitDocSnap.exists()) {
          toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Το ακίνητο δεν βρέθηκε.' });
          router.push('/units');
          return;
        }

        const unitData = { id: unitDocSnap.id, ...unitDocSnap.data() } as Unit;
        setUnit(unitData);

        unitForm.reset({
          identifier: unitData.identifier,
          name: unitData.name,
          type: unitData.type || '',
          status: unitData.status,
          floorIds: unitData.floorIds || [],
          netArea: unitData.netArea?.toString() || '',
          grossArea: unitData.grossArea?.toString() || '',
          commonArea: unitData.commonArea?.toString() || '',
          semiOutdoorArea: unitData.semiOutdoorArea?.toString() || '',
          architecturalProjectionsArea: unitData.architecturalProjectionsArea?.toString() || '',
          balconiesArea: unitData.balconiesArea?.toString() || '',
          price: unitData.price?.toString() || '',
          bedrooms: unitData.bedrooms?.toString() || '',
          bathrooms: unitData.bathrooms || '',
          orientation: unitData.orientation || '',
          kitchenLayout: unitData.kitchenLayout || '',
          description: unitData.description || '',
          isPenthouse: unitData.isPenthouse || false,
          amenities: unitData.amenities || [],
          levelSpan: unitData.levelSpan || 1,
        });
        setIsLoading(false);
    }, (error) => {
        console.error("Error fetching unit details:", error);
        toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Failed to load unit data.' });
        setIsLoading(false);
    });
    
    const attachmentsQuery = query(collection(db, 'attachments'), where('unitId', '==', unitId));
    const unsubscribeAttachments = onSnapshot(attachmentsQuery, (snapshot) => {
        const attachmentsData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as AttachmentFormValues));
        setAttachments(attachmentsData);
    }, (error) => {
        console.error("Error fetching attachments:", error);
    });

    return () => {
        unsubscribeUnit();
        unsubscribeAttachments();
    };
  }, [unitId, router, toast, unitForm]);

  const onUnitSubmit = async (data: UnitFormValues) => {
    if (!unit) return;
    setIsSubmitting(true);
    
    const unitDataToUpdate = getUnitDataFromForm(data);

    try {
        await updateDoc(doc(db, 'units', unit.id), unitDataToUpdate);
        toast({ title: 'Επιτυχία', description: 'Οι αλλαγές στο ακίνητο αποθηκεύτηκαν.' });
        unitForm.reset(data); // Sync form state to show it's no longer dirty
        await logActivity('UPDATE_UNIT', {
          entityId: unit.id,
          entityType: 'unit',
          changes: data,
          projectId: unit.projectId
        });
    } catch(error) {
        console.error("Failed to save unit:", error);
        toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Η αποθήκευση απέτυχε.' });
    } finally {
        setIsSubmitting(false);
    }
  };

  const onSubmitAttachment = async(data: AttachmentFormValues) => {
    if(!unit) return;
    setIsSubmitting(true);

    const finalAttData: any = {
        ...getAttachmentDataFromForm(data),
        unitId: unit.id,
        bundleUnitId: data.isBundle ? unit.id : undefined,
    };
     Object.keys(finalAttData).forEach(key => finalAttData[key] === undefined && delete finalAttData[key]);

    try {
        if (editingAttachment?.id) {
            const attRef = doc(db, 'attachments', editingAttachment.id);
            await updateDoc(attRef, finalAttData);
            toast({ title: 'Επιτυχία', description: 'Το παρακολούθημα ενημερώθηκε.' });
            await logActivity('UPDATE_ATTACHMENT', { entityId: editingAttachment.id, entityType: 'attachment', changes: finalAttData, projectId: unit.projectId });
        } else {
            const newAttRef = await addDoc(collection(db, 'attachments'), { ...finalAttData, createdAt: serverTimestamp() });
            toast({ title: 'Επιτυχία', description: 'Το παρακολούθημα δημιουργήθηκε.' });
            await logActivity('CREATE_ATTACHMENT', { entityId: newAttRef.id, entityType: 'attachment', details: finalAttData, projectId: unit.projectId });
        }
        handleAttachmentDialogChange(false);
    } catch(error) {
        console.error("Failed to save attachment:", error);
        toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Η αποθήκευση απέτυχε.' });
    } finally {
        setIsSubmitting(false);
    }
  }

  const handleDeleteAttachment = async (attachmentId: string) => {
      try {
          const attRef = doc(db, 'attachments', attachmentId);
          const attDoc = await getDoc(attRef);
          const attData = attDoc.data();
          await deleteDoc(attRef);
          toast({title: 'Επιτυχία', description: 'Το παρακολούθημα διαγράφηκε.'});
          await logActivity('DELETE_ATTACHMENT', { entityId: attachmentId, entityType: 'attachment', details: attData, projectId: unit?.projectId });
      } catch (error) {
          console.error("Error deleting attachment:", error);
          toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Η διαγραφή απέτυχε.' });
      }
  }

  const handleAttachmentDialogChange = (open: boolean) => {
      setIsAttachmentDialogOpen(open);
      if(!open) {
          setEditingAttachment(null);
          attachmentForm.reset();
      }
  }

  const handleAddNewAttachment = () => {
      setEditingAttachment(null);
      attachmentForm.reset({
          type: 'parking', identifier: '', details: '', area: '', price: '', sharePercentage: '', isBundle: true, isStandalone: false
      });
      setIsAttachmentDialogOpen(true);
  }
  
  const handleEditAttachment = (attachment: AttachmentFormValues) => {
      setEditingAttachment(attachment);
      attachmentForm.reset(attachment);
      setIsAttachmentDialogOpen(true);
  }

  return {
    unit,
    attachments,
    isLoading,
    isSubmitting,
    isAttachmentDialogOpen,
    editingAttachment,
    unitForm,
    attachmentForm,
    onUnitSubmit: unitForm.handleSubmit(onUnitSubmit),
    onSubmitAttachment: attachmentForm.handleSubmit(onSubmitAttachment),
    handleAttachmentDialogChange,
    handleAddNewAttachment,
    handleEditAttachment,
    handleDeleteAttachment,
    goBack: () => router.back(),
    getStatusClass,
  };
}
