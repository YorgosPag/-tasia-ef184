"use client";

import { Timestamp } from "firebase/firestore";
import { format } from "date-fns";

export interface Floor {
  id: string;
  level: string;
  description?: string;
  createdAt: any;
}

export interface Building {
  id: string;
  projectId: string;
  originalId?: string;
}

export const formatDate = (timestamp: any): string => {
  if (!timestamp) return "N/A";
  return format(timestamp.toDate(), "dd/MM/yyyy");
};
