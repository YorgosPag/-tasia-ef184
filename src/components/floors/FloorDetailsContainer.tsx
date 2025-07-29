
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  doc,
  onSnapshot,
  Timestamp,
  writeBatch,
  getDoc,
  updateDoc,
  query,
  collection,
  where,
} from 'firebase/firestore';
import { db, storage } from '@/shared/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useToast } from '@/shared/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { FloorInfoHeader } from '@/components/floors/FloorInfoHeader';
import { FloorPlanCard } from '@/components/floors/FloorPlanCard';
import { logActivity } from '@/shared/lib/logger';
import { useAuth } from '@/shared/hooks/use-auth';

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

interface Building {
    originalId?: string;
    projectId?: string;
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
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  
  // --- Data Fetching Effects ---
  useEffect(() => {
    if (!floorId) return;

    setIsLoading(true);
    const docRef = doc(db, 'floors', floorId);
    const unsubscribeFloor = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setFloor({ id: docSnap.id, ...docSnap.data() } as Floor);
      } else {
        toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Ο όροφος δεν βρέθηκε.' });
        router.push('/buildings');
      }
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching floor:", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to fetch floor details.' });
      setIsLoading(false);
    });
    
    return () => {
      unsubscribeFloor();
    };
  }, [floorId, router, toast]);
  

  const handleFileUpload = async (file: File) => {
    if (!file || !floor || !user) return;
    setIsUploading(true);
    const storageRef = ref(storage, `floor_plans/${floor.id}/${file.name}`);
    try {
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);

        const batch = writeBatch(db);

        const topLevelFloorRef = doc(db, 'floors', floor.id);
        batch.update(topLevelFloorRef, { floorPlanUrl: downloadURL });

        const buildingDoc = await getDoc(doc(db, 'buildings', floor.buildingId));
        if (buildingDoc.exists()) {
            const buildingData = buildingDoc.data() as Building;
            if (buildingData.projectId && floor.originalId) {
                const subCollectionFloorRef = doc(db, 'projects', buildingData.projectId, 'buildings', buildingData.originalId, 'floors', floor.originalId);
                const subDocSnap = await getDoc(subCollectionFloorRef);
                if (subDocSnap.exists()) {
                   batch.update(subCollectionFloorRef, { floorPlanUrl: downloadURL });
                }
            }
        }
        await batch.commit();
        
        toast({ title: 'Επιτυχία', description: 'Η κάτοψη ανέβηκε.' });
        await logActivity('UPLOAD_FLOORPLAN', {
            entityId: floor.id,
            entityType: 'floorplan',
            details: `Uploaded ${file.name} for floor ${floor.level}`,
            projectId: buildingDoc.data()?.projectId,
        });

    } catch (error: any) {
        console.error("Upload error:", error);
        toast({ variant: 'destructive', title: 'Σφάλμα', description: `Δεν ήταν δυνατή η μεταφόρτωση: ${error.message}` });
    } finally {
        setIsUploading(false);
    }
  };


  if (isLoading || !floor) {
    return <div className="flex justify-center items-center h-full"><Loader2 className="h-16 w-16 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <FloorInfoHeader
        floor={floor}
        onBack={() => router.back()}
        isUploading={isUploading}
        onFileUpload={handleFileUpload}
      />
      <FloorPlanCard
        floorPlanUrl={floor.floorPlanUrl}
      />
    </div>
  );
}
