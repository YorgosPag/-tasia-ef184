"use client";

import { doc, arrayUnion, writeBatch, Timestamp, collection } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import type { WorkStage, WorkStageWithSubstages } from "@/lib/types/project-types";

/**
 * Manages extra functionalities for work stages, like photo uploads and comments.
 * @param projectId The ID of the current project.
 * @param workStages The array of all work stages.
 */
export function useWorkStageExtras(
  projectId: string,
  workStages: WorkStageWithSubstages[],
) {
  const { user } = useAuth();
  const { toast } = useToast();

  const handlePhotoUpload = async (
    stage: WorkStage,
    files: FileList,
    isSubstage: boolean,
  ) => {
    if (!files.length || !user || !projectId) return;
    const parentId = isSubstage
      ? workStages.find((ws) =>
          ws.workSubstages?.some((ss) => ss.id === stage.id),
        )?.id
      : undefined;
    if (isSubstage && !parentId) return;
    const docRef = parentId
      ? doc(
          db,
          "projects",
          projectId,
          "workStages",
          parentId,
          "workSubstages",
          stage.id,
        )
      : doc(db, "projects", projectId, "workStages", stage.id);
    toast({
      title: "Ανέβασμα...",
      description: `Ανέβασμα ${files.length} φωτογραφιών...`,
    });
    try {
      const photoUploadPromises = Array.from(files).map(async (file) => {
        const photoRef = ref(
          storage,
          `work_stages_photos/${projectId}/${stage.id}/${file.name}`,
        );
        await uploadBytes(photoRef, file);
        const url = await getDownloadURL(photoRef);
        return {
          url,
          uploadedAt: Timestamp.now(),
          uploadedBy: user.email || user.uid,
          name: file.name,
        };
      });
      const newPhotos = await Promise.all(photoUploadPromises);
      const batch = writeBatch(db);
      batch.update(docRef, { photos: arrayUnion(...newPhotos) });
      const topLevelId = (stage as any).topLevelId;
      if (topLevelId) {
        const topLevelRef = parentId
          ? doc(db, "workSubstages", topLevelId)
          : doc(db, "workStages", topLevelId);
        batch.update(topLevelRef, { photos: arrayUnion(...newPhotos) });
      }
      await batch.commit();
      toast({
        title: "Επιτυχία",
        description: "Οι φωτογραφίες ανέβηκαν επιτυχώς.",
      });
    } catch (error) {
      console.error("Photo upload failed:", error);
      toast({
        variant: "destructive",
        title: "Σφάλμα",
        description: "Το ανέβασμα των φωτογραφιών απέτυχε.",
      });
    }
  };

  const handleCommentSubmit = async (
    stage: WorkStage,
    comment: string,
    isSubstage: boolean,
  ) => {
    if (!projectId || !user?.email) return;
    const parentId = isSubstage
      ? workStages.find((ws) =>
          ws.workSubstages?.some((ss) => ss.id === stage.id),
        )?.id
      : undefined;
    if (isSubstage && !parentId) return;
    const docRef = parentId
      ? doc(
          db,
          "projects",
          projectId,
          "workStages",
          parentId,
          "workSubstages",
          stage.id,
        )
      : doc(db, "projects", projectId, "workStages", stage.id);
    const newComment = {
      id: doc(collection(db, "dummy")).id,
      text: comment,
      authorId: user.uid,
      authorEmail: user.email,
      createdAt: Timestamp.now(),
      type: user.photoURL === "client" ? "client" : "internal",
    };
    const batch = writeBatch(db);
    batch.update(docRef, { comments: arrayUnion(newComment) });
    const topLevelId = (stage as any).topLevelId;
    if (topLevelId) {
      const topLevelRef = parentId
        ? doc(db, "workSubstages", topLevelId)
        : doc(db, "workStages", topLevelId);
      batch.update(topLevelRef, { comments: arrayUnion(newComment) });
    }
    await batch.commit();
  };

  return { handlePhotoUpload, handleCommentSubmit };
}
