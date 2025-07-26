
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  collection,
  doc,
  writeBatch,
  getDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';
import { useToast } from '@/shared/hooks/use-toast';
import { logActivity } from '@/shared/lib/logger';
import { UnitFormValues, unitSchema } from '@/tasia/components/units/UnitDialogForm';
import { Unit } from '../Unit';

interface UseFloorPlanDataManagerProps {
  floorId: string;
  initialUnits: Unit[];
}

export function useFloorPlanDataManager({ floorId, initialUnits }: UseFloorPlanDataManagerProps) {
  const { toast } = useToast();
  const [units, setUnits] = useState<Unit[]>(initialUnits);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [drawingPolygon, setDrawingPolygon] = useState<{ x: number; y: number }[] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [highlightedUnitId, setHighlightedUnitId] = useState<string | null>(null);

  useEffect(() => {
    setUnits(initialUnits);
  }, [initialUnits]);

  const form = useForm<UnitFormValues>({
    resolver: zodResolver(unitSchema),
    defaultValues: {
      identifier: '', name: '', type: '', status: 'Διαθέσιμο', polygonPoints: '',
      existingUnitId: 'new',
      area: '', price: '', bedrooms: '', bathrooms: '', orientation: '', amenities: '',
    },
  });

  const unitsWithoutPolygon = useMemo(() => units.filter(u => !u.polygonPoints || u.polygonPoints.length === 0), [units]);

  useEffect(() => {
    if (editingUnit) {
      form.reset({
        identifier: editingUnit.identifier,
        name: editingUnit.name,
        type: (editingUnit as any).type || '',
        status: editingUnit.status,
        polygonPoints: editingUnit.polygonPoints ? JSON.stringify(editingUnit.polygonPoints, null, 2) : '',
        existingUnitId: editingUnit.id,
        area: (editingUnit as any).area?.toString() || '',
        price: (editingUnit as any).price?.toString() || '',
        bedrooms: (editingUnit as any).bedrooms?.toString() || '',
        bathrooms: (editingUnit as any).bathrooms?.toString() || '',
        orientation: (editingUnit as any).orientation || '',
        amenities: (editingUnit as any).amenities?.join(', ') || '',
      });
    } else if (drawingPolygon) {
      form.reset({
        identifier: '', name: '', type: '', status: 'Διαθέσιμο', 
        polygonPoints: JSON.stringify(drawingPolygon, null, 2),
        existingUnitId: 'new',
        area: '', price: '', bedrooms: '', bathrooms: '', orientation: '', amenities: '',
      });
    } else {
      form.reset({
        identifier: '', name: '', type: '', status: 'Διαθέσιμο', polygonPoints: '',
        existingUnitId: 'new',
        area: '', price: '', bedrooms: '', bathrooms: '', orientation: '', amenities: '',
      });
    }
  }, [editingUnit, drawingPolygon, form]);

  const getParsedPolygonPoints = (data: UnitFormValues) => {
    if (data.polygonPoints && data.polygonPoints.trim() !== '') {
      try {
        const pointsArray = JSON.parse(data.polygonPoints);
        return Array.isArray(pointsArray) && pointsArray.every(p => typeof p.x === 'number' && typeof p.y === 'number') ? pointsArray : null;
      } catch (e) {
        toast({ variant: 'destructive', title: 'Σφάλμα στις συντεταγμένες', description: 'Οι συντεταγμένες δεν είναι έγκυρο JSON.' });
        return null;
      }
    }
    return undefined;
  };
  
  const getUnitDataFromForm = (data: UnitFormValues) => ({
      identifier: data.identifier,
      name: data.name,
      type: data.type || '',
      status: data.status,
      area: data.area ? parseFloat(data.area) : undefined,
      price: data.price ? parseFloat(data.price) : undefined,
      bedrooms: data.bedrooms ? parseInt(data.bedrooms, 10) : undefined,
      bathrooms: data.bathrooms ? parseInt(data.bathrooms, 10) : undefined,
      orientation: data.orientation || '',
      amenities: data.amenities ? data.amenities.split(',').map(a => a.trim()).filter(Boolean) : [],
  });

  const updateUnitInFirestore = async (unitId: string, dataToUpdate: any) => {
    const unitToUpdate = units.find(u => u.id === unitId) as any;
    if (!unitToUpdate) return false;

    const batch = writeBatch(db);
    batch.update(doc(db, 'units', unitId), dataToUpdate);

    const floorDoc = await getDoc(doc(db, 'floors', unitToUpdate.floorId));
    const floorData = floorDoc.data();
    if (floorData?.buildingId) {
        const buildingDoc = await getDoc(doc(db, 'buildings', floorData.buildingId));
        if (buildingDoc.exists() && buildingDoc.data().projectId && unitToUpdate.originalId) {
            const subDocRef = doc(db, 'projects', buildingDoc.data().projectId, 'buildings', buildingDoc.data().originalId, 'floors', unitToUpdate.floorId, 'units', unitToUpdate.originalId);
            if((await getDoc(subDocRef)).exists()) batch.update(subDocRef, dataToUpdate);
        }
    }
    
    try {
        await batch.commit();
        return true;
    } catch (error) {
      console.error('Error updating unit:', error);
      toast({ variant: 'destructive', title: 'Σφάλμα Ενημέρωσης', description: 'Δεν ήταν δυνατή η ενημέρωση του ακινήτου.' });
      return false;
    }
  };

  const createNewUnit = async (data: UnitFormValues, parsedPolygonPoints?: any[]) => {
    const floorDocSnap = await getDoc(doc(db, 'floors', floorId));
    if (!floorDocSnap.exists()) {
        toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Δεν βρέθηκε γονικός όροφος.' });
        return null;
    }
    const floorData = floorDocSnap.data();
    const buildingDocSnap = await getDoc(doc(db, 'buildings', floorData.buildingId));
    if (!buildingDocSnap.exists()) {
        toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Δεν βρέθηκε γονικό κτίριο.' });
        return null;
    }
    const buildingData = buildingDocSnap.data();

    const batch = writeBatch(db);
    const topLevelUnitRef = doc(collection(db, 'units'));
    const finalUnitData: any = {
      ...getUnitDataFromForm(data),
      ...(parsedPolygonPoints && { polygonPoints: parsedPolygonPoints }),
      floorIds: [floorId],
      buildingId: floorData.buildingId,
      projectId: buildingData.projectId,
      createdAt: serverTimestamp(),
    };
    
    if (buildingData.projectId && buildingData.originalId && floorData.originalId) {
        const subCollectionUnitRef = doc(collection(db, 'projects', buildingData.projectId, 'buildings', buildingData.originalId, 'floors', floorData.originalId, 'units'));
        batch.set(subCollectionUnitRef, { ...finalUnitData, topLevelId: topLevelUnitRef.id });
        batch.set(topLevelUnitRef, { ...finalUnitData, originalId: subCollectionUnitRef.id });
    } else {
        batch.set(topLevelUnitRef, { ...finalUnitData, originalId: topLevelUnitRef.id });
    }
    
    try {
      await batch.commit();
      await logActivity('CREATE_UNIT', { entityId: topLevelUnitRef.id, entityType: 'unit', name: finalUnitData.name, projectId: buildingData.projectId });
      return topLevelUnitRef.id;
    } catch (error) {
      console.error('Error creating unit:', error);
      return null;
    }
  };

  const onSubmitUnit = async (data: UnitFormValues) => {
    setIsSubmitting(true);
    const parsedPoints = getParsedPolygonPoints(data);
    let success = false;
    
    if (editingUnit) {
      success = await updateUnitInFirestore(editingUnit.id, { ...getUnitDataFromForm(data), polygonPoints: parsedPoints });
    } else if (drawingPolygon && data.existingUnitId !== 'new') {
      success = await updateUnitInFirestore(data.existingUnitId!, { polygonPoints: parsedPoints });
    } else {
      const newUnitId = await createNewUnit(data, parsedPoints);
      success = !!newUnitId;
    }

    if (success) {
        setIsDialogOpen(false);
        setEditingUnit(null);
        setDrawingPolygon(null);
    }
    setIsSubmitting(false);
  };
  
  const handleDeleteUnit = async (unitId: string) => {
    const unitToDelete = units.find(u => u.id === unitId) as any;
    if (!unitToDelete) return;

    const batch = writeBatch(db);
    batch.delete(doc(db, 'units', unitId));
    const floorDoc = await getDoc(doc(db, 'floors', unitToDelete.floorId));
    const floorData = floorDoc.data();
    if(floorData?.buildingId) {
        const buildingDoc = await getDoc(doc(db, 'buildings', floorData.buildingId));
        if(buildingDoc.exists() && buildingDoc.data().projectId && floorData.originalId) {
            const subRef = doc(db, 'projects', buildingDoc.data().projectId, 'buildings', buildingDoc.data().originalId, 'floors', floorData.originalId, 'units', unitToDelete.originalId);
            if((await getDoc(subRef)).exists()) batch.delete(subRef);
        }
    }
    
    const attachmentsSnapshot = await getDocs(query(collection(db, 'attachments'), where('unitId', '==', unitId)));
    attachmentsSnapshot.forEach(d => batch.delete(d.ref));
    
    await batch.commit();
    toast({ title: 'Επιτυχία', description: 'Το ακίνητο διαγράφηκε.' });
    await logActivity('DELETE_UNIT', { entityId: unitId, entityType: 'unit', name: unitToDelete.name, projectId: unitToDelete.projectId });
  };
  
  const handleDuplicateUnit = async (unitId: string) => {
    const unitToClone = units.find(u => u.id === unitId);
    if (!unitToClone) return;

    const { id, originalId, createdAt, identifier, name, ...clonedData } = unitToClone as any;
    const newFormValues = {
        ...clonedData,
        identifier: `${identifier} (Copy)`, name: `${name} (Copy)`,
        polygonPoints: JSON.stringify(clonedData.polygonPoints || [], null, 2),
    };

    const newUnitId = await createNewUnit(newFormValues, clonedData.polygonPoints);
    if (newUnitId) toast({ title: 'Επιτυχία', description: `Το ακίνητο '${name}' αντιγράφηκε.` });
  };
  
  const handleUnitPointsUpdate = useCallback(async (unitId: string, newPoints: any) => {
    const unit = units.find(u => u.id === unitId);
    if (!unit || !unit.polygonPoints) return;
    
    setUnits(prev => prev.map(u => u.id === unitId ? { ...u, polygonPoints: newPoints } : u));
    
    const success = await updateUnitInFirestore(unitId, { polygonPoints: newPoints });
    if(success) toast({ title: "Το σχήμα ενημερώθηκε", description: "Οι νέες συντεταγμένες αποθηκεύτηκαν." });
  }, [units, toast]);


  return {
    units,
    setUnits,
    form,
    isSubmitting,
    handleDeleteUnit,
    handleDuplicateUnit,
    onSubmitUnit,
    editingUnit,
    setEditingUnit,
    drawingPolygon,
    setDrawingPolygon,
    isDialogOpen,
    setIsDialogOpen,
    handleUnitPointsUpdate,
    unitsWithoutPolygon,
    highlightedUnitId,
    setHighlightedUnitId,
  };
}
