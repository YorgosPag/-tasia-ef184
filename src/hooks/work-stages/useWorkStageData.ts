"use client";

import { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type {
  WorkStage,
  WorkStageWithSubstages,
} from "@/lib/types/project-types";

/**
 * Fetches and manages real-time work stage and substage data for a project.
 * @param projectId The ID of the project.
 */
export function useWorkStageData(projectId: string) {
  const [workStages, setWorkStages] = useState<WorkStageWithSubstages[]>([]);
  const [isLoadingWorkStages, setIsLoadingWorkStages] = useState(true);

  useEffect(() => {
    if (!projectId) {
      setIsLoadingWorkStages(false);
      return;
    }

    const workStagesQuery = query(
      collection(db, "projects", projectId, "workStages"),
      orderBy("createdAt", "asc"),
    );

    const unsubscribe = onSnapshot(
      workStagesQuery,
      async (workStagesSnapshot) => {
        const workStagesDataPromises = workStagesSnapshot.docs.map(
          async (doc) => {
            const docData = doc.data();
            const workStage: WorkStageWithSubstages = {
              id: doc.id,
              name: docData.name || "",
              status: docData.status || "Εκκρεμεί",
              ...docData,
              workSubstages: [],
            } as WorkStageWithSubstages;
            const workSubstagesQuery = query(
              collection(
                db,
                "projects",
                projectId,
                "workStages",
                workStage.id,
                "workSubstages",
              ),
              orderBy("createdAt", "asc"),
            );
            const workSubstagesSnapshot = await getDocs(workSubstagesQuery);
            workStage.workSubstages = workSubstagesSnapshot.docs.map(
              (subDoc) => ({ id: subDoc.id, ...subDoc.data() }) as WorkStage,
            );
            return workStage;
          },
        );

        const workStagesData = await Promise.all(workStagesDataPromises);
        setWorkStages(workStagesData);
        setIsLoadingWorkStages(false);
      },
      (error) => {
        console.error("Error fetching work stages:", error);
        setIsLoadingWorkStages(false);
      },
    );

    return () => unsubscribe();
  }, [projectId]);

  return { workStages, setWorkStages, isLoadingWorkStages };
}
