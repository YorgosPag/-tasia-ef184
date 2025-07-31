"use client";

import { useState, useEffect, useMemo } from "react";
import { UseFormReturn } from "react-hook-form";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Company, Project, Building } from "@/hooks/use-data-store";

interface Floor {
  value: string;
  label: string;
}

export function useUnitLocationState(
  data: { companies: Company[]; projects: Project[]; buildings: Building[] },
  form: UseFormReturn<any>,
) {
  const { companies, projects, buildings } = data;
  const [isLoadingFloors, setIsLoadingFloors] = useState(false);
  const [floors, setFloors] = useState<Floor[]>([]);

  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedBuilding, setSelectedBuilding] = useState(
    form.getValues("buildingId") || "",
  );

  useEffect(() => {
    if (selectedCompany) {
      form.setValue("projectId", "");
      setSelectedProject("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCompany]);

  useEffect(() => {
    if (selectedProject) {
      form.setValue("buildingId", "");
      setSelectedBuilding("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProject]);

  useEffect(() => {
    form.setValue("floorIds", []);
    const fetchFloors = async () => {
      if (!selectedBuilding) {
        setFloors([]);
        return;
      }
      setIsLoadingFloors(true);
      try {
        const floorsQuery = query(
          collection(db, "floors"),
          where("buildingId", "==", selectedBuilding),
        );
        const snapshot = await getDocs(floorsQuery);
        const floorsData = snapshot.docs
          .map((doc) => ({ value: doc.id, label: doc.data().level as string }))
          .sort((a, b) =>
            a.label.localeCompare(b.label, undefined, { numeric: true }),
          );
        setFloors(floorsData);
      } catch (e) {
        console.error("Failed to fetch floors for building:", e);
        setFloors([]);
      } finally {
        setIsLoadingFloors(false);
      }
    };
    fetchFloors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBuilding]);

  const floorIds = form.watch("floorIds");
  useEffect(() => {
    const span = Array.isArray(floorIds) ? floorIds.length : 0;
    form.setValue("levelSpan", span);
  }, [floorIds, form]);

  const filteredProjects = useMemo(
    () => projects.filter((p) => p.companyId === selectedCompany),
    [projects, selectedCompany],
  );
  const filteredBuildings = useMemo(
    () => buildings.filter((b) => b.projectId === selectedProject),
    [buildings, selectedProject],
  );

  const floorOptions = useMemo(() => {
    return floors.map((f) => ({ value: f.value, label: f.label }));
  }, [floors]);

  return {
    companies,
    selectedCompany,
    setSelectedCompany,
    filteredProjects,
    selectedProject,
    setSelectedProject,
    filteredBuildings,
    selectedBuilding,
    setSelectedBuilding,
    floors: floorOptions,
    isLoadingFloors,
  };
}
