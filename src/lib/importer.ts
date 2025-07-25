
'use server';

import {
  collection,
  query,
  where,
  getDocs,
  writeBatch,
  serverTimestamp,
  doc,
  getDoc,
  addDoc,
} from 'firebase/firestore';
import { db } from './firebase';

// --- Interfaces ---
interface ImportRow {
  projectTitle: string;
  buildingAddress: string;
  floorLevel: string;
  unitIdentifier: string;
  [key: string]: any; // Allow other properties
}

interface ImportResult {
  totalRows: number;
  buildingsCreated: number;
  floorsCreated: number;
  unitsCreated: number;
  errors: { row: number; message: string }[];
}

// --- Caching for a single import run ---
const localCache = new Map<string, string>();

/**
 * Finds an existing document or prepares to create a new one.
 * It now properly checks the database for duplicates before deciding to create.
 * @returns {Promise<{id: string, isNew: boolean}>} The document ID and a flag indicating if it's a new creation.
 */
async function findOrPrepareDoc(
  collectionName: string,
  keyField: string,
  key: string,
  extraData: Record<string, any> = {}
): Promise<{ id: string; isNew: boolean }> {
  const cacheKey = `${collectionName}-${keyField}-${key}`;
  if (localCache.has(cacheKey)) {
    return { id: localCache.get(cacheKey)!, isNew: false };
  }

  // Check Firestore for an existing document
  const q = query(collection(db, collectionName), where(keyField, '==', key));
  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    const docId = snapshot.docs[0].id;
    localCache.set(cacheKey, docId);
    return { id: docId, isNew: false };
  }
  
  // If no document exists, prepare a new one
  if (['projects', 'companies'].includes(collectionName)) {
      throw new Error(`Required document in '${collectionName}' with ${keyField}='${key}' not found. Please create it first.`);
  }

  const newDocRef = doc(collection(db, collectionName));
  localCache.set(cacheKey, newDocRef.id);
  return { id: newDocRef.id, isNew: true };
}


/**
 * Processes a file (Excel or CSV) for bulk import into Firestore.
 * @param file The file to process.
 * @returns A promise that resolves with the import result.
 */
export async function processImportFile(file: File): Promise<ImportResult> {
  const XLSX = await import('xlsx');
  const result: ImportResult = {
    totalRows: 0,
    buildingsCreated: 0,
    floorsCreated: 0,
    unitsCreated: 0,
    errors: [],
  };

  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet) as ImportRow[];

  result.totalRows = data.length;
  localCache.clear(); // Clear local cache for each new import run

  let batch = writeBatch(db);
  let writeCount = 0;

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const rowIndex = i + 2; // Excel rows are 1-based, +1 for header

    try {
      // --- Validate required fields ---
      if (!row.projectTitle) throw new Error("Missing required column: projectTitle.");
      if (!row.buildingAddress) throw new Error("Missing required column: buildingAddress.");
      if (!row.floorLevel) throw new Error("Missing required column: floorLevel.");
      if (!row.unitIdentifier) throw new Error("Missing required column: unitIdentifier.");
      
      // --- Resolve Hierarchy ---
      // Projects must exist beforehand
      const projectQuery = query(collection(db, 'projects'), where('title', '==', row.projectTitle));
      const projectSnapshot = await getDocs(projectQuery);
      if (projectSnapshot.empty) throw new Error(`Project '${row.projectTitle}' not found.`);
      const projectDoc = projectSnapshot.docs[0];
      const projectId = projectDoc.id;
      const { companyId } = projectDoc.data();


      // Find or Prepare Building
      const { id: buildingId, isNew: isNewBuilding } = await findOrPrepareDoc('buildings', 'address', row.buildingAddress);
      
      // Find or Prepare Floor
      // Key for a floor is its level *within a specific building*
      const floorKey = `${buildingId}_${row.floorLevel}`;
      const { id: floorId, isNew: isNewFloor } = await findOrPrepareDoc('floors', 'uniqueKey', floorKey);

      // --- Prepare Batch Writes ---
      if (isNewBuilding) {
        const topLevelBuildingRef = doc(db, 'buildings', buildingId);
        const buildingData = {
            address: row.buildingAddress,
            type: row.buildingType || 'Πολυκατοικία',
            projectId: projectId,
            createdAt: serverTimestamp(),
        };
        batch.set(topLevelBuildingRef, buildingData);
        result.buildingsCreated++;
        writeCount++;
      }
      
      if (isNewFloor) {
         const topLevelFloorRef = doc(db, 'floors', floorId);
         const floorData = {
            level: row.floorLevel.toString(),
            buildingId: buildingId,
            uniqueKey: floorKey, // Store the compound key for future lookups
            createdAt: serverTimestamp(),
         };
         batch.set(topLevelFloorRef, floorData);
         result.floorsCreated++;
         writeCount++;
      }
      
      // Check for duplicate Unit before writing
      const unitQuery = query(collection(db, 'units'), where('identifier', '==', row.unitIdentifier), where('floorIds', 'array-contains', floorId));
      const unitSnapshot = await getDocs(unitQuery);
      if (!unitSnapshot.empty) {
          throw new Error(`Unit with identifier '${row.unitIdentifier}' already exists on this floor.`);
      }

      // Create Unit (always new from the file, after duplicate check)
      const topLevelUnitRef = doc(collection(db, 'units'));
      const unitData = {
        identifier: row.unitIdentifier,
        name: row.unitName || `Ακίνητο ${row.unitIdentifier}`,
        status: row.unitStatus || 'Διαθέσιμο',
        type: row.unitType || '',
        area: parseFloat(row.area) || undefined,
        price: parseFloat(row.price) || undefined,
        bedrooms: parseInt(row.bedrooms, 10) || undefined,
        bathrooms: parseInt(row.bathrooms, 10) || undefined,
        floorIds: [floorId],
        buildingId: buildingId,
        projectId: projectId,
        companyId: companyId,
        createdAt: serverTimestamp(),
      };
      batch.set(topLevelUnitRef, unitData);
      result.unitsCreated++;
      writeCount++;

      // Commit batch if it's getting full to avoid hitting limits
      if (writeCount >= 490) {
        await batch.commit();
        batch = writeBatch(db);
        writeCount = 0;
      }

    } catch (error: any) {
      result.errors.push({ row: rowIndex, message: error.message });
    }
  }

  // Commit any remaining writes in the last batch
  if (writeCount > 0) {
    await batch.commit();
  }

  return result;
}
