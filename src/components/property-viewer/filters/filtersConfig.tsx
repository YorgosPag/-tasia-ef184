"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { FilterState } from "./types";

export const MOCK_DATA: Record<keyof FilterState, string[]> = {
  project: ["Έργο Α", "Έργο Β", "Έργο Γ"],
  building: ["Κτίριο 1", "Κτίριο 2", "Κτίριο 3"],
  floor: ["Υπόγειο", "Ισόγειο", "1ος Όροφος", "2ος Όροφος"],
  propertyType: ["Στούντιο", "Γκαρσονιέρα", "Διαμέρισμα 2Δ", "Διαμέρισμα 3Δ", "Μεζονέτα", "Κατάστημα"],
  status: ["for-sale", "for-rent", "sold", "rented", "reserved"],
};

export const filterConfig: Array<{ key: keyof FilterState; label: string }> = [
  { key: "project", label: "Έργο" },
  { key: "building", label: "Κτίριο" },
  { key: "floor", label: "Όροφος" },
  { key: "propertyType", label: "Τύπος Ακινήτου" },
  { key: "status", label: "Κατάσταση" },
];

export const statusConfig: Record<string, { label: string; color: string }> = {
  'for-sale': {
    label: 'Προς Πώληση',
    color: 'bg-green-100 text-green-800 border-green-200',
  },
  'for-rent': {
    label: 'Προς Ενοικίαση',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  'sold': {
    label: 'Πουλημένο',
    color: 'bg-red-100 text-red-800 border-red-200',
  },
  'rented': {
    label: 'Ενοικιασμένο',
    color: 'bg-orange-100 text-orange-800 border-orange-200',
  },
  'reserved': {
    label: 'Δεσμευμένο',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  },
};

export const statusRenderOptions = (value: string) => {
    const config = statusConfig[value];
    if (!config) return value;
    return <Badge variant="outline" className={cn("text-xs font-normal", config.color)}>{config.label}</Badge>;
}
