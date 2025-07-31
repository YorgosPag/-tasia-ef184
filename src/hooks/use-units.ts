"use client";

import { collection, Timestamp, getDocs, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useQuery } from "@tanstack/react-query";

export interface Unit {
  id: string;
  identifier: string;
  name: string;
  type?: string;
  status:
    | "Διαθέσιμο"
    | "Κρατημένο"
    | "Πωλημένο"
    | "Οικοπεδούχος"
    | "Προς Ενοικίαση";
  floorIds: string[];
  levelSpan?: string;
  buildingId: string;
  createdAt: any;
  area?: number;
  price?: number;
  bedrooms?: number;
  bathrooms?: number;
  orientation?: string;
  amenities?: string[];
  photoUrl?: string; // Add photoUrl for the card view
}

async function fetchUnits(): Promise<Unit[]> {
  const unitsCollection = collection(db, "units");
  const snapshot = await getDocs(query(unitsCollection));
  const units = snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() }) as Unit,
  );
  return units;
}

export function useUnits() {
  return useQuery<Unit[], Error>({
    queryKey: ["units"],
    queryFn: fetchUnits,
  });
}
