"use client";

import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
  useCallback,
} from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  serverTimestamp,
  Timestamp,
  query,
  getDocs,
  Query,
  where,
  DocumentData,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "./use-auth";
import { logActivity } from "@/lib/logger";
import { useQuery } from "@tanstack/react-query";

// --- Interfaces ---
export interface Company {
  id: string;
  name: string;
  logoUrl?: string;
  website?: string;
  contactInfo: {
    email: string;
    phone?: string;
    address?: string;
    afm?: string;
  };
  createdAt: any;
}

export interface Building {
  id: string;
  address: string;
  type: string;
  projectId: string;
  originalId?: string; // Add originalId
}

export interface Project {
  id: string;
  title: string;
  companyId: string;
  location?: string;
  description?: string;
  deadline: Timestamp;
  status: "Ενεργό" | "Σε εξέλιξη" | "Ολοκληρωμένο";
  photoUrl?: string;
  tags?: string[];
  createdAt: any;
}

interface DataStoreContextType {
  // This context is now primarily for actions, not data
  addCompany: (
    companyData: Omit<Company, "id" | "createdAt">,
  ) => Promise<string | null>;
  addProject: (
    projectData: Omit<Project, "id" | "createdAt" | "deadline" | "tags"> & {
      deadline: Date;
      tags?: string;
    },
  ) => Promise<string | null>;
}

const DataStoreContext = createContext<DataStoreContextType | undefined>(
  undefined,
);

// --- Provider ---
export function DataProvider({ children }: { children: ReactNode }) {
  const addCompany = useCallback(
    async (
      companyData: Omit<Company, "id" | "createdAt">,
    ): Promise<string | null> => {
      try {
        const docRef = await addDoc(collection(db, "companies"), {
          ...companyData,
          createdAt: serverTimestamp(),
        });
        await logActivity("CREATE_COMPANY", {
          entityId: docRef.id,
          entityType: "company",
          name: companyData.name,
        });
        return docRef.id;
      } catch (e) {
        console.error("Error adding company:", e);
        return null;
      }
    },
    [],
  );

  const addProject = useCallback(
    async (
      projectData: Omit<Project, "id" | "createdAt" | "deadline" | "tags"> & {
        deadline: Date;
        tags?: string;
      },
    ): Promise<string | null> => {
      try {
        const { tags, ...restOfData } = projectData;
        const finalData = {
          ...restOfData,
          tags: tags
            ? tags
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean)
            : [],
          deadline: Timestamp.fromDate(projectData.deadline),
          createdAt: serverTimestamp(),
        };
        const docRef = await addDoc(collection(db, "projects"), finalData);
        await logActivity("CREATE_PROJECT", {
          entityId: docRef.id,
          entityType: "project",
          name: projectData.title,
        });
        return docRef.id;
      } catch (e) {
        console.error("Error adding project:", e);
        return null;
      }
    },
    [],
  );

  return (
    <DataStoreContext.Provider value={{ addCompany, addProject }}>
      {children}
    </DataStoreContext.Provider>
  );
}

// --- Specialized Hooks (Selector Pattern) ---

async function fetchCollection<T>(
  collectionName: string,
  queryConstraints: Query<DocumentData> = query(collection(db, collectionName)),
): Promise<T[]> {
  const snapshot = await getDocs(queryConstraints);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as T);
}

export function useCompanies() {
  const {
    data: companies = [],
    isLoading,
    isError,
  } = useQuery<Company[]>({
    queryKey: ["companies"],
    queryFn: () => fetchCollection<Company>("companies"),
  });
  return { companies, isLoading, isError };
}

export function useProjects() {
  const {
    data: projects = [],
    isLoading,
    isError,
  } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: () => fetchCollection<Project>("projects"),
  });
  return { projects, isLoading, isError };
}

export function useBuildings() {
  const {
    data: buildings = [],
    isLoading,
    isError,
  } = useQuery<Building[]>({
    queryKey: ["buildings"],
    queryFn: () => fetchCollection<Building>("buildings"),
  });
  return { buildings, isLoading, isError };
}

// --- Hook for Actions ---
export const useDataActions = () => {
  const context = useContext(DataStoreContext);
  if (context === undefined) {
    throw new Error("useDataActions must be used within a DataProvider");
  }
  return context;
};
