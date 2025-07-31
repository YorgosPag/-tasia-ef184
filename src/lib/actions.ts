"use server";

import { clearTasiaData as clearTasia } from "./clear";
import { db } from "./firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  limit,
  getDocs,
  where,
  orderBy,
} from "firebase/firestore";
import { logActivity } from "./logger";

async function isAdmin(userId: string): Promise<boolean> {
  if (!userId) return false;

  const userDocRef = doc(db, "users", userId);
  try {
    const userDoc = await getDoc(userDocRef);
    return userDoc.exists() && userDoc.data().role === "admin";
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

async function isFirstUser(): Promise<boolean> {
  const usersRef = collection(db, "users");
  const q = query(usersRef, limit(1));
  const snapshot = await getDocs(q);
  return snapshot.empty;
}

export async function seedTasiaDataAction(userId: string) {
  if (!(await isAdmin(userId))) {
    return {
      success: false,
      error: "Unauthorized: Only admins can seed data.",
    };
  }
  try {
    // await seedTasia(); // Seeding function is removed as requested
    await logActivity("SEED_DATA", {
      entityType: "database",
      details: { app: "TASIA" },
      userId,
    });
    return {
      success: true,
      message: "Tasia seeding function is currently disabled.",
    };
  } catch (error) {
    console.error("TASIA Seeding failed:", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function clearTasiaDataAction(userId: string) {
  if (!userId) {
    return {
      success: false,
      error: "Unauthorized: You must be logged in to clear data.",
    };
  }
  try {
    await clearTasia();
    await logActivity("CLEAR_DATA", {
      entityType: "database",
      details: { app: "TASIA" },
      userId,
    });
    return { success: true };
  } catch (error) {
    console.error("TASIA Clearing failed:", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function seedNestorDataAction(userId: string) {
  return { success: false, error: "Nestor app has been removed." };
}

export async function clearNestorDataAction(userId: string) {
  return { success: false, error: "Nestor app has been removed." };
}

export async function generateNextUnitIdentifierAction(
  floorId: string,
  unitType: string,
  levelSpan: number,
): Promise<string> {
  const floorDocRef = doc(db, "floors", floorId);
  const floorDoc = await getDoc(floorDocRef);
  if (!floorDoc.exists()) {
    throw new Error("Floor not found");
  }

  const buildingId = floorDoc.data().buildingId;
  const buildingDocRef = doc(db, "buildings", buildingId);
  const buildingDoc = await getDoc(buildingDocRef);
  if (!buildingDoc.exists()) {
    throw new Error("Building not found");
  }

  const buildingIdentifier = buildingDoc.data().identifier || "B";
  const floorLevel = floorDoc.data().level || "L";

  let unitTypePrefix = "U";
  if (unitType === "Διαμέρισμα") unitTypePrefix = "D";
  else if (unitType === "Στούντιο") unitTypePrefix = "S";
  else if (unitType === "Γκαρσονιέρα") unitTypePrefix = "G";
  else if (unitType === "Μεζονέτα") unitTypePrefix = "M";
  else if (unitType === "Κατάστημα") unitTypePrefix = "C";

  // Find the last identifier for this type on this floor
  const unitsQuery = query(
    collection(db, "units"),
    where("floorIds", "array-contains", floorId),
    where("type", "==", unitType),
    orderBy("identifier", "desc"),
    limit(1),
  );

  const snapshot = await getDocs(unitsQuery);
  let lastNumber = 0;
  if (!snapshot.empty) {
    const lastIdentifier = snapshot.docs[0].data().identifier;
    const match = lastIdentifier.match(new RegExp(`${unitTypePrefix}(\\d+)$`));
    if (match) {
      lastNumber = parseInt(match[1], 10);
    }
  }

  const nextNumber = lastNumber + 1;
  const levelIndicator =
    levelSpan > 1 ? `-${parseInt(floorLevel, 10) + levelSpan - 1}` : "";

  return `${buildingIdentifier}${floorLevel}${levelIndicator}${unitTypePrefix}${nextNumber}`;
}

export async function generateNextAttachmentIdentifierAction(
  unitId: string,
  attachmentType: "parking" | "storage",
): Promise<string> {
  const unitDocRef = doc(db, "units", unitId);
  const unitDoc = await getDoc(unitDocRef);
  if (!unitDoc.exists()) {
    throw new Error("Unit not found");
  }

  const unitIdentifier = unitDoc.data().identifier;
  const attachmentPrefix = attachmentType === "parking" ? "P" : "S";

  const attachmentsQuery = query(
    collection(db, "attachments"),
    where("unitId", "==", unitId),
    where("type", "==", attachmentType),
    orderBy("identifier", "desc"),
    limit(1),
  );

  const snapshot = await getDocs(attachmentsQuery);
  let lastNumber = 0;
  if (!snapshot.empty) {
    const lastIdentifier = snapshot.docs[0].data().identifier;
    const match = lastIdentifier.match(/-[PS](\d+)$/);
    if (match) {
      lastNumber = parseInt(match[1], 10);
    }
  }

  const nextNumber = lastNumber + 1;
  return `${unitIdentifier}-${attachmentPrefix}${nextNumber}`;
}
