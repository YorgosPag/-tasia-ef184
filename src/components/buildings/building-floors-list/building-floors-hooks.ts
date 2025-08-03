"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  collection,
  onSnapshot,
  writeBatch,
  doc,
  serverTimestamp,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { logActivity } from "@/lib/logger";
import { floorSchema, type FloorFormValues } from "@/components/buildings/NewFloorDialog";
import type { Building, Floor } from "./building-floors-utils";


export function useFloors(buildingId: string) {
  const [floors, setFloors] = useState<Floor[]>([]);
  const [isLoadingFloors, setIsLoadingFloors] = useState(true);
  const { toast } = useToast();

  const fetchFloors = useCallback(() => {
    if (!buildingId) return () => {};
    
    setIsLoadingFloors(true);
    const q = query(
      collection(db, "floors"),
      where("buildingId", "==", buildingId),
      orderBy("level", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const floorsData: Floor[] = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Floor)
      );
      setFloors(floorsData);
      setIsLoadingFloors(false);
    }, (error) => {
      console.error("Error fetching floors: ", error);
      toast({
        variant: "destructive",
        title: "Σφάλμα",
        description: "Δεν ήταν δυνατή η φόρτωση των ορόφων.",
      });
      setIsLoadingFloors(false);
    });

    return unsubscribe;
  }, [buildingId, toast]);

  useEffect(() => {
    const unsubscribe = fetchFloors();
    return () => unsubscribe();
  }, [fetchFloors]);

  return { floors, isLoadingFloors, refetchFloors: fetchFloors };
}

export function useFloorForm() {
  const form = useForm<FloorFormValues>({
    resolver: zodResolver(floorSchema),
    defaultValues: { level: "", description: "", floorPlanUrl: "" },
  });
  return { form };
}

export function useFloorActions(
  building: Building,
  form: ReturnType<typeof useFloorForm>['form'],
  refetchFloors: () => void
) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) form.reset();
  };

  const onSubmitFloor = async (data: FloorFormValues) => {
    if (!building.projectId || !building.originalId) {
      toast({ variant: "destructive", title: "Σφάλμα", description: "Δεν βρέθηκε το γονικό κτίριο." });
      return;
    }
    setIsSubmitting(true);
    try {
      const batch = writeBatch(db);
      const subCollectionFloorRef = doc(collection(db, "projects", building.projectId, "buildings", building.originalId, "floors"));
      const topLevelFloorRef = doc(collection(db, "floors"));

      const finalData = {
        level: data.level,
        description: data.description || "",
        floorPlanUrl: data.floorPlanUrl?.trim() ? data.floorPlanUrl : null,
      };

      batch.set(subCollectionFloorRef, { ...finalData, topLevelId: topLevelFloorRef.id, createdAt: serverTimestamp() });
      batch.set(topLevelFloorRef, { ...finalData, buildingId: building.id, originalId: subCollectionFloorRef.id, createdAt: serverTimestamp() });
      await batch.commit();

      toast({ title: "Επιτυχία", description: "Ο όροφος προστέθηκε." });
      await logActivity("CREATE_FLOOR", { entityId: topLevelFloorRef.id, entityType: "floor", details: finalData, projectId: building.projectId });
      
      handleDialogOpenChange(false);
      refetchFloors();
    } catch (error: any) {
      console.error("Error adding floor: ", error);
      toast({ variant: "destructive", title: "Σφάλμα", description: `Η προσθήκη του ορόφου απέτυχε: ${error.message}` });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRowClick = (floorId: string) => {
    router.push(`/floors/${floorId}`);
  };

  return {
    isDialogOpen,
    isSubmitting,
    handleDialogOpenChange,
    onSubmitFloor,
    handleRowClick,
  };
}
