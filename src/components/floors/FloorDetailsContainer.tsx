
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  doc,
  getDoc,
  collection,
  onSnapshot,
  addDoc,
  serverTimestamp,
  Timestamp,
  updateDoc,
  setDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  writeBatch,
} from 'firebase/firestore';
import { db, storage, auth } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';

import { FloorInfoHeader } from './FloorInfoHeader';
import { FloorPlanCard } from './FloorPlanCard';
import { UnitsListTable } from './UnitsListTable';
import { UnitDialogForm, UnitFormValues, unitSchema } from '@/components/units/UnitDialogForm';
import { useFloorPlanState } from '@/hooks/floor-plan/useFloorPlanState';


// --- Interfaces & Schemas ---
interface Floor {
  id: string;
  level: string;
  description?: string;
  buildingId: string;
  originalId: string;
  createdAt: Timestamp;
  floorPlanUrl?: string;
}

export interface Unit extends Omit<UnitFormValues, 'polygonPoints' | 'existingUnitId'> {
  id: string;
  createdAt: any;
  polygonPoints?: { x: number; y: number }[];
  status: 'Διαθέσιμο' | 'Κρατημένο' | 'Πωλημένο' | 'Οικοπεδούχος';
  originalId: string;
  floorId: string;
}

/**
 * FloorDetailsContainer is the main "smart" component for the floor details page.
 * It handles all data fetching, state management, and business logic (CRUD operations for units, file uploads).
 * It then passes down data and callbacks to its "dumb" child components.
 */
export function FloorDetailsContainer() {
  const params = useParams();
  const router = useRouter();
  const floorId = params.id as string;
  const { toast } = useToast();

  // --- State Management ---
  const [floor, setFloor] = useState<Floor | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [isLoadingFloor, setIsLoadingFloor] = useState(true);
  const [isLoadingUnits, setIsLoadingUnits] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [drawingPolygon, setDrawingPolygon] = useState<{ x: number; y: number }[] | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const handlePolygonDrawn = useCallback((points: { x: number; y: number }[]) => {
    setEditingUnit(null);
    setDrawingPolygon(points);
    setIsDialogOpen(true);
  }, []);
  
  const { statusColors } = useFloorPlanState({ onPolygonDrawn: handlePolygonDrawn });

  const form = useForm<UnitFormValues>({
    resolver: zodResolver(unitSchema),
    defaultValues: {
      identifier: '', name: '', type: '', status: 'Διαθέσιμο', polygonPoints: '',
      existingUnitId: 'new',
    },
  });

  const unitsWithoutPolygon = units.filter(u => !u.polygonPoints || u.polygonPoints.length === 0);

  // --- Data Fetching Effects ---
  useEffect(() => {
    if (!floorId) return;
    const docRef = doc(db, 'floors', floorId);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setFloor({ id: docSnap.id, ...docSnap.data() } as Floor);
      } else {
        toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Ο όροφος δεν βρέθηκε.' });
        router.push('/buildings');
      }
      setIsLoadingFloor(false);
    }, (error) => {
      console.error("Error fetching floor:", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to fetch floor details.' });
      setIsLoadingFloor(false);
    });
    return () => unsubscribe();
  }, [floorId, router, toast]);

  useEffect(() => {
    if (!floorId) return;
    setIsLoadingUnits(true);
    const q = query(collection(db, 'units'), where('floorId', '==', floorId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUnits(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Unit)));
      setIsLoadingUnits(false);
    }, (error) => {
      console.error('Error fetching units:', error);
      toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Δεν ήταν δυνατή η φόρτωση των ακινήτων.' });
      setIsLoadingUnits(false);
    });
    return () => unsubscribe();
  }, [floorId, toast]);

  // --- Form & Dialog Effects ---
  useEffect(() => {
    if (editingUnit) {
      form.reset({
        identifier: editingUnit.identifier,
        name: editingUnit.name,
        type: editingUnit.type || '',
        status: editingUnit.status,
        polygonPoints: editingUnit.polygonPoints ? JSON.stringify(editingUnit.polygonPoints, null, 2) : '',
        existingUnitId: editingUnit.id,
      });
    } else if (drawingPolygon) {
      form.reset({
        identifier: '', name: '', type: '', status: 'Διαθέσιμο', 
        polygonPoints: JSON.stringify(drawingPolygon, null, 2),
        existingUnitId: 'new'
      });
    } else {
      form.reset({
        identifier: '', name: '', type: '', status: 'Διαθέσιμο', polygonPoints: '',
        existingUnitId: 'new'
      });
    }
  }, [editingUnit, drawingPolygon, form]);

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setDrawingPolygon(null);
      setEditingUnit(null);
      form.reset({ identifier: '', name: '', type: '', status: 'Διαθέσιμο', polygonPoints: '', existingUnitId: 'new' });
    }
  };

  // --- Firestore Logic ---
  const getParsedPolygonPoints = (data: UnitFormValues) => {
    if (data.polygonPoints && data.polygonPoints.trim() !== '') {
      try {
        const pointsArray = JSON.parse(data.polygonPoints);
        if (Array.isArray(pointsArray) && pointsArray.every(p => typeof p.x === 'number' && typeof p.y === 'number')) {
          return pointsArray;
        } else {
          throw new Error('Invalid points format.');
        }
      } catch (e) {
        toast({ variant: 'destructive', title: 'Σφάλμα στις συντεταγμένες', description: 'Οι συντεταγμένες δεν είναι έγκυρο JSON.' });
        return null;
      }
    }
    return undefined;
  };

  const updateUnitInFirestore = async (unitId: string, dataToUpdate: any) => {
    const unitToUpdate = units.find(u => u.id === unitId);
    if (!unitToUpdate || !floor) return false;
    
    try {
      const buildingDoc = await getDoc(doc(db, 'buildings', floor.buildingId));
      if (!buildingDoc.exists()) throw new Error("Parent building not found");
      const buildingData = buildingDoc.data();
      const batch = writeBatch(db);
      
      batch.update(doc(db, 'units', unitId), dataToUpdate);

      if (buildingData.projectId && buildingData.originalId && unitToUpdate.originalId) {
        const subDocRef = doc(db, 'projects', buildingData.projectId, 'buildings', buildingData.originalId, 'floors', floor.originalId, 'units', unitToUpdate.originalId);
        const subDocSnap = await getDoc(subDocRef);
        if (subDocSnap.exists()) {
          batch.update(subDocRef, dataToUpdate);
        }
      }
      await batch.commit();
      return true;
    } catch (error) {
      console.error('Error updating unit:', error);
      toast({ variant: 'destructive', title: 'Σφάλμα Ενημέρωσης', description: 'Δεν ήταν δυνατή η ενημέρωση του ακινήτου.' });
      return false;
    }
  };

  const onSubmitUnit = async (data: UnitFormValues) => {
    setIsSubmitting(true);
    const parsedPolygonPoints = getParsedPolygonPoints(data);
    if (data.polygonPoints && parsedPolygonPoints === null) {
        setIsSubmitting(false);
        return; // Invalid JSON for points
    }

    let success = false;
    
    // Case 1: Editing an existing unit's details
    if (editingUnit) {
      const unitData = {
          identifier: data.identifier, name: data.name, type: data.type, status: data.status,
          ...(parsedPolygonPoints !== undefined && { polygonPoints: parsedPolygonPoints }),
      };
      success = await updateUnitInFirestore(editingUnit.id, unitData);
      if (success) toast({ title: 'Επιτυχία', description: 'Το ακίνητο ενημερώθηκε.' });
    
    // Case 2: Linking a new polygon to an existing unit
    } else if (drawingPolygon && data.existingUnitId !== 'new') {
        const unitId = data.existingUnitId;
        success = await updateUnitInFirestore(unitId, { polygonPoints: parsedPolygonPoints });
        if (success) toast({ title: 'Επιτυχία', description: 'Το πολύγωνο συνδέθηκε με το ακίνητο.' });
    
    // Case 3: Creating a new unit (either from a polygon or from scratch)
    } else {
      if (!floor || !floor.buildingId || !floor.originalId) {
        toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Δεν βρέθηκε γονικός όροφος/κτίριο.' });
      } else {
        try {
          const buildingDoc = await getDoc(doc(db, 'buildings', floor.buildingId));
          if (!buildingDoc.exists()) throw new Error("Parent building not found");
          const buildingData = buildingDoc.data();
          
          const batch = writeBatch(db);
          const topLevelUnitRef = doc(collection(db, 'units'));
          
          const finalUnitData: any = {
            identifier: data.identifier, name: data.name, type: data.type, status: data.status,
            ...(parsedPolygonPoints && { polygonPoints: parsedPolygonPoints }),
            floorId: floor.id,
            buildingId: floor.buildingId,
            createdAt: serverTimestamp(),
          };

          if (buildingData.projectId && buildingData.originalId) {
            const subCollectionUnitRef = doc(collection(db, 'projects', buildingData.projectId, 'buildings', buildingData.originalId, 'floors', floor.originalId, 'units'));
            batch.set(subCollectionUnitRef, finalUnitData);
            batch.set(topLevelUnitRef, { ...finalUnitData, originalId: subCollectionUnitRef.id });
          } else {
             batch.set(topLevelUnitRef, { ...finalUnitData, originalId: topLevelUnitRef.id });
          }

          await batch.commit();

          toast({ title: 'Επιτυχία', description: 'Το ακίνητο προστέθηκε.' });
          success = true;
        } catch (error) {
          console.error('Error adding unit:', error);
          toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Δεν ήταν δυνατή η προσθήκη του ακινήτου.' });
        }
      }
    }

    setIsSubmitting(false);
    if (success) {
      handleDialogOpenChange(false);
    }
  };

  const handleDeleteUnit = async (unitId: string) => {
    const unitToDelete = units.find(u => u.id === unitId);
    if (!unitToDelete || !floor) return;
    try {
      const buildingDoc = await getDoc(doc(db, 'buildings', floor.buildingId));
      if (!buildingDoc.exists()) throw new Error("Parent building not found");
      const buildingData = buildingDoc.data();
      const batch = writeBatch(db);
      batch.delete(doc(db, 'units', unitId));
      if (buildingData.projectId && buildingData.originalId && unitToDelete.originalId) {
        const subDocRef = doc(db, 'projects', buildingData.projectId, 'buildings', buildingData.originalId, 'floors', floor.originalId, 'units', unitToDelete.originalId);
        if ((await getDoc(subDocRef)).exists()) batch.delete(subDocRef);
      }
      const attachmentsSnapshot = await getDocs(query(collection(db, 'attachments'), where('unitId', '==', unitId)));
      attachmentsSnapshot.forEach(attachmentDoc => batch.delete(attachmentDoc.ref));
      await batch.commit();
      toast({ title: "Επιτυχία", description: "Το ακίνητο διαγράφηκε." });
    } catch (error) {
      console.error('Error deleting unit:', error);
      toast({ variant: 'destructive', title: 'Σφάλμα Διαγραφής', description: 'Δεν ήταν δυνατή η διαγραφή.' });
    }
  };
  
  const handleUnitPointsUpdate = useCallback(async (unitId: string, newPoints: { x: number; y: number }[]) => {
    const success = await updateUnitInFirestore(unitId, { polygonPoints: newPoints });
    
    if (success) {
      toast({ title: "Το σχήμα ενημερώθηκε", description: "Οι νέες συντεταγμένες αποθηκεύτηκαν." });
    }
  }, [units, toast, floor]);


  // --- UI Event Handlers ---
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    } else if (file) {
      toast({ variant: 'destructive', title: 'Λάθος τύπος αρχείου', description: 'Παρακαλώ επιλέξτε ένα αρχείο PDF.' });
      setSelectedFile(null);
    }
    event.target.value = ''; // Reset file input
  };

  const handleFileUpload = async () => {
    if (!selectedFile || !floorId || !auth.currentUser) return;
    setIsUploading(true);
    const storageRef = ref(storage, `floor_plans/${floorId}/${selectedFile.name}`);
    try {
      await uploadBytes(storageRef, selectedFile);
      const downloadURL = await getDownloadURL(storageRef);
      const batch = writeBatch(db);
      batch.update(doc(db, 'floors', floorId), { floorPlanUrl: downloadURL });
      if (floor?.originalId && floor.buildingId) {
        const buildingDoc = await getDoc(doc(db, 'buildings', floor.buildingId));
        const buildingData = buildingDoc.data();
        if (buildingData?.projectId && buildingData?.originalId) {
          const subDocRef = doc(db, 'projects', buildingData.projectId, 'buildings', buildingData.originalId, 'floors', floor.originalId);
          if ((await getDoc(subDocRef)).exists()) {
            batch.update(subDocRef, { floorPlanUrl: downloadURL });
          }
        }
      }
      await batch.commit();
      toast({ title: 'Επιτυχία', description: 'Η κάτοψη ανέβηκε.' });
      setSelectedFile(null);
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({ variant: 'destructive', title: 'Σφάλμα', description: `Δεν ήταν δυνατή η μεταφόρτωση: ${error.message}` });
    } finally {
      setIsUploading(false);
    }
  };

  const handleUnitSelectForEdit = (unitId: string) => {
    const unitToEdit = units.find(u => u.id === unitId);
    if (unitToEdit) {
      setDrawingPolygon(null);
      setEditingUnit(unitToEdit);
      setIsDialogOpen(true);
    }
  };

  const handleAddNewUnitClick = () => {
    setEditingUnit(null);
    setDrawingPolygon(null);
    setIsDialogOpen(true);
  };
  
  if (isLoadingFloor || !floor) {
    return <div className="flex justify-center items-center h-full"><Loader2 className="h-16 w-16 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <FloorInfoHeader
        floor={floor}
        onBack={() => router.back()}
        onFileChange={handleFileChange}
        onFileUpload={handleFileUpload}
        selectedFile={selectedFile}
        isUploading={isUploading}
      />
      <FloorPlanCard
        floorPlanUrl={floor.floorPlanUrl}
        units={units}
        setUnits={setUnits}
        onUnitClick={handleUnitSelectForEdit}
        onUnitDelete={handleDeleteUnit}
        onPolygonDrawn={handlePolygonDrawn}
        onUnitPointsUpdate={handleUnitPointsUpdate}
      />
      <UnitsListTable
        units={units}
        isLoading={isLoadingUnits}
        statusColors={statusColors}
        onAddNewUnit={handleAddNewUnitClick}
        onEditUnit={handleUnitSelectForEdit}
        onDeleteUnit={handleDeleteUnit}
        onViewUnit={(unitId) => router.push(`/units/${unitId}`)}
      />
      <UnitDialogForm
        open={isDialogOpen}
        onOpenChange={handleDialogOpenChange}
        onSubmit={form.handleSubmit(onSubmitUnit)}
        form={form}
        isSubmitting={isSubmitting}
        editingUnit={editingUnit}
        drawingPolygon={drawingPolygon}
        availableUnits={unitsWithoutPolygon}
      />
    </div>
  );
}
