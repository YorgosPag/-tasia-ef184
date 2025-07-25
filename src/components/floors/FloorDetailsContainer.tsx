
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  doc,
  onSnapshot,
  Timestamp,
  writeBatch,
  getDoc,
  query,
  collection,
} from 'firebase/firestore';
import { db, storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

import { FloorInfoHeader } from './FloorInfoHeader';
import { FloorPlanCard } from './FloorPlanCard';
import { logActivity } from '@/lib/logger';
import { useAuth } from '@/hooks/use-auth';
import type { Unit } from '@/components/floor-plan/Unit';


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

/**
 * FloorDetailsContainer is the main "smart" component for the floor details page.
 * It handles all data fetching, state management, and business logic (file uploads).
 * It then passes down data and callbacks to its "dumb" child components.
 */
export function FloorDetailsContainer() {
  const params = useParams();
  const router = useRouter();
  const floorId = params.id as string;
  const { toast } = useToast();
  const { user } = useAuth();

  // --- State Management ---
  const [floor, setFloor] = useState<Floor | null>(null);
  const [initialUnits, setInitialUnits] = useState<Unit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  

  // --- Data Fetching Effects ---
  useEffect(() => {
    if (!floorId) return;

    let unsubFloor: () => void;
    let unsubUnits: () => void;

    const fetchData = async () => {
        setIsLoading(true);
        try {
            // Fetch floor details
            const docRef = doc(db, 'floors', floorId);
            unsubFloor = onSnapshot(docRef, (docSnap) => {
              if (docSnap.exists()) {
                setFloor({ id: docSnap.id, ...docSnap.data() } as Floor);
              } else {
                toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Ο όροφος δεν βρέθηκε.' });
                router.push('/buildings');
              }
            }, (error) => {
              console.error("Error fetching floor:", error);
              toast({ variant: 'destructive', title: 'Error', description: 'Failed to fetch floor details.' });
            });

            // Fetch initial units
            const unitsQuery = query(collection(db, 'units'), where('floorIds', 'array-contains', floorId));
            unsubUnits = onSnapshot(unitsQuery, (snapshot) => {
                setInitialUnits(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Unit)));
                setIsLoading(false);
            }, (error) => {
                console.error('Error fetching units:', error);
                toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Δεν ήταν δυνατή η φόρτωση των ακινήτων.' });
                setIsLoading(false);
            });

        } catch (error) {
            console.error("Error setting up listeners", error);
            setIsLoading(false);
        }
    }
    
    fetchData();

    return () => {
      if (unsubFloor) unsubFloor();
      if (unsubUnits) unsubUnits();
    };
  }, [floorId, router, toast]);
  

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
    if (!selectedFile || !floorId || !user) return;
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
      await logActivity('UPLOAD_FLOORPLAN', {
        entityId: floorId,
        entityType: 'floorplan',
        details: `Uploaded ${selectedFile.name} for floor ${floorId}`,
      });
      setSelectedFile(null);
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({ variant: 'destructive', title: 'Σφάλμα', description: `Δεν ήταν δυνατή η μεταφόρτωση: ${error.message}` });
    } finally {
      setIsUploading(false);
    }
  };

  const handleUnitSelect = (unitId: string) => {
    router.push(`/units/${unitId}`);
  };

  if (isLoading || !floor) {
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
        floorId={floor.id}
        floorPlanUrl={floor.floorPlanUrl}
        initialUnits={initialUnits}
        onUnitClick={handleUnitSelect}
      />
    </div>
  );
}
