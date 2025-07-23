
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
} from 'firebase/firestore';
import { db } from './firebase';
import * as XLSX from 'xlsx';

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

// --- Caching ---
// Simple in-memory cache to avoid re-fetching the same documents during a single import operation.
const cache = new Map<string, string>();

async function findOrCreateDoc(
  collectionName: string,
  keyField: string,
  key: string,
  extraData: Record<string, any> = {}
): Promise<string> {
  const cacheKey = `${collectionName}-${keyField}-${key}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!;
  }

  const q = query(collection(db, collectionName), where(keyField, '==', key));
  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    const docId = snapshot.docs[0].id;
    cache.set(cacheKey, docId);
    return docId;
  } else {
    // For this importer, we only create entities that are part of the core hierarchy.
    // We assume Projects and Companies already exist. For buildings, floors, units, we create them.
    if (['buildings', 'floors', 'units'].includes(collectionName)) {
      const newDocRef = doc(collection(db, collectionName));
      // We don't write it yet, just get the ID. The batch will write it.
      cache.set(cacheKey, newDocRef.id);
      return newDocRef.id;
    }
    throw new Error(`Required document in '${collectionName}' with ${keyField}='${key}' not found.`);
  }
}

/**
 * Processes a file (Excel or CSV) for bulk import into Firestore.
 * @param file The file to process.
 * @returns A promise that resolves with the import result.
 */
export async function processImportFile(file: File): Promise<ImportResult> {
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
  cache.clear(); // Clear cache for each new import

  let batch = writeBatch(db);
  let writeCount = 0;

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const rowIndex = i + 2; // Account for header row

    try {
      // --- Validate required fields ---
      if (!row.projectTitle || !row.buildingAddress || !row.floorLevel || !row.unitIdentifier) {
        throw new Error('Missing required columns: projectTitle, buildingAddress, floorLevel, unitIdentifier.');
      }
      
      // --- Resolve Hierarchy ---
      const projectId = await findOrCreateDoc('projects', 'title', row.projectTitle);
      const projectDoc = await getDoc(doc(db, 'projects', projectId));
      if (!projectDoc.exists()) throw new Error(`Project '${row.projectTitle}' not found.`);
      const { companyId } = projectDoc.data();

      // Find or get ID for Building
      const buildingId = await findOrCreateDoc('buildings', 'address', row.buildingAddress);
      
      // Find or get ID for Floor
      const floorId = await findOrCreateDoc('floors', 'level', row.floorLevel, { buildingId });

      // --- Prepare Batch Writes ---
      // We only create a new doc if it wasn't already in the cache from a previous lookup in this run
      if (!cache.has(`buildings-address-${row.buildingAddress}`)) {
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
        cache.set(`buildings-address-${row.buildingAddress}`, buildingId);
      }
      
      if (!cache.has(`floors-level-${row.floorLevel}`)) {
         const topLevelFloorRef = doc(db, 'floors', floorId);
         const floorData = {
            level: row.floorLevel,
            buildingId: buildingId,
            createdAt: serverTimestamp(),
         };
         batch.set(topLevelFloorRef, floorData);
         result.floorsCreated++;
         writeCount++;
         cache.set(`floors-level-${row.floorLevel}`, floorId);
      }
      
      // Create Unit (always new from the file)
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

      // Commit batch if it's getting full
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
