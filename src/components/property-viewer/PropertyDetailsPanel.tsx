"use client";

import React from "react";
import { Home, MousePointer } from "lucide-react";
import { PropertyDetailsContent } from "./details/PropertyDetailsContent";
import type { PropertyDetails } from "./details/types";

// Mock data - will be replaced with actual data fetching
const mockPropertyDetails: Record<string, PropertyDetails> = {
  "prop-1": {
    id: "prop-1",
    name: "Αποθήκη A1",
    type: "Αποθήκη",
    building: "Κτίριο Alpha",
    floor: -1,
    project: "Έργο Κέντρο",
    status: "for-sale",
    price: 25000,
    area: 15,
    description: "Ευρύχωρη αποθήκη στο υπόγειο με εύκολη πρόσβαση.",
    features: ["Κλιματισμός", "Ασφάλεια", "Εύκολη Πρόσβαση"],
    owner: {
      name: "Γιάννης Παπαδόπουλος",
      phone: "6944123456",
      email: "giannis@example.com",
    },
    agent: {
      name: "Μαρία Κωνσταντίνου",
      phone: "6955987654",
      email: "maria@realestate.com",
    },
    dates: {
      created: "2024-01-15",
      updated: "2024-02-20",
      available: "2024-03-01",
    },
    documents: [
      {
        id: "doc-1",
        name: "Ενεργειακή Κλάση",
        type: "PDF",
        url: "/documents/energy-class.pdf",
      },
      {
        id: "doc-2",
        name: "Κάτοψη",
        type: "DWG",
        url: "/documents/floor-plan.dwg",
      },
    ],
  },
  "prop-2": {
    id: "prop-2",
    name: "Στούντιο B1",
    type: "Στούντιο",
    building: "Κτίριο Beta",
    floor: 1,
    project: "Έργο Νότος",
    status: "sold",
    price: 85000,
    area: 35,
    rooms: 1,
    bathrooms: 1,
    description: "Μοντέρνο στούντιο με μεγάλο μπαλκόνι και θέα στη θάλασσα.",
    features: ["Μπαλκόνι", "Θέα Θάλασσα", "Ανακαινισμένο", "Ηλιόλουστο"],
    owner: {
      name: "Ελένη Γεωργίου",
      phone: "6933456789",
      email: "eleni@example.com",
    },
    dates: {
      created: "2024-01-10",
      updated: "2024-02-15",
    },
    documents: [
      {
        id: "doc-3",
        name: "Τίτλος Ιδιοκτησίας",
        type: "PDF",
        url: "/documents/title-deed.pdf",
      },
    ],
  },
};

interface PropertyDetailsPanelProps {
  propertyId: string | null;
}

export function PropertyDetailsPanel({ propertyId }: PropertyDetailsPanelProps) {
  if (!propertyId) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4">
        <Home className="h-8 w-8 mb-2" />
        <p className="text-sm text-center">Επιλέξτε ένα ακίνητο από τη λίστα</p>
        <p className="text-xs text-center">για να δείτε τα στοιχεία του</p>
      </div>
    );
  }

  const property = mockPropertyDetails[propertyId];

  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4">
        <Home className="h-8 w-8 mb-2" />
        <p className="text-sm text-center">Δεν βρέθηκαν στοιχεία</p>
        <p className="text-xs text-center">για το επιλεγμένο ακίνητο</p>
      </div>
    );
  }

  return <PropertyDetailsContent property={property} />;
}