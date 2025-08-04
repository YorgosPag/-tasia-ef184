"use client";

import { MousePointer, Home } from "lucide-react";
import { PropertyHoverContent } from "./hover/PropertyHoverContent";
import type { PropertyHoverData } from "./hover/types";

// Mock data - θα αντικατασταθεί με πραγματικά δεδομένα
const mockHoverData: Record<string, PropertyHoverData> = {
  "prop-1": {
    id: "prop-1",
    name: "Αποθήκη A1",
    type: "Αποθήκη",
    building: "Κτίριο Alpha",
    floor: -1,
    status: "for-sale",
    price: 25000,
    area: 15,
    quickInfo: "Ευρύχωρη αποθήκη με εύκολη πρόσβαση",
  },
  "prop-2": {
    id: "prop-2",
    name: "Στούντιο B1",
    type: "Στούντιο",
    building: "Κτίριο Beta",
    floor: 1,
    status: "sold",
    price: 85000,
    area: 35,
    quickInfo: "Μοντέρνο στούντιο με θέα",
  },
  "prop-3": {
    id: "prop-3",
    name: "Διαμέρισμα 2Δ C1",
    type: "Διαμέρισμα 2Δ",
    building: "Κτίριο Gamma",
    floor: 2,
    status: "for-rent",
    price: 750,
    area: 65,
    quickInfo: "Ηλιόλουστο διαμέρισμα σε ήσυχη περιοχή",
  },
  "prop-4": {
    id: "prop-4",
    name: "Κατάστημα D1",
    type: "Κατάστημα",
    building: "Κτίριο Delta",
    floor: 0,
    status: "rented",
    price: 1200,
    area: 45,
    quickInfo: "Κατάστημα σε εμπορικό δρόμο",
  },
  "prop-5": {
    id: "prop-5",
    name: "Μεζονέτα E1",
    type: "Μεζονέτα",
    building: "Κτίριο Epsilon",
    floor: 3,
    status: "reserved",
    price: 145000,
    area: 85,
    quickInfo: "Πολυτελής μεζονέτα με δύο επίπεδα",
  },
};

interface PropertyHoverInfoProps {
  propertyId: string | null;
}

export function PropertyHoverInfo({ propertyId }: PropertyHoverInfoProps) {
  if (!propertyId) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4">
        <MousePointer className="h-6 w-6 mb-2" />
        <p className="text-xs text-center">Περάστε το ποντίκι</p>
        <p className="text-xs text-center">πάνω από ένα ακίνητο</p>
        <p className="text-xs text-center mt-1 text-muted-foreground/70">
          για να δείτε
        </p>
        <p className="text-xs text-center text-muted-foreground/70">
          γρήγορες πληροφορίες
        </p>
      </div>
    );
  }

  const property = mockHoverData[propertyId];

  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4">
        <Home className="h-6 w-6 mb-2" />
        <p className="text-xs text-center">Δεν βρέθηκαν στοιχεία</p>
        <p className="text-xs text-center">για αυτό το ακίνητο</p>
      </div>
    );
  }

  return <PropertyHoverContent property={property} />;
}
