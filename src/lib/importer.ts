
'use server';

import {
  collection,
  writeBatch,
  serverTimestamp,
  doc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import * as XLSX from 'xlsx';

// --- Interfaces ---
interface ImportRow {
  [key: string]: any; 
}

interface ImportResult {
  totalRows: number;
  unitsCreated: number;
  errors: { rowData: ImportRow, message: string, row: number }[];
}

const BATCH_LIMIT = 400; // Keep it safely below the 500 limit

/**
 * Processes a file (Excel or CSV) for bulk import into Firestore.
 * @param formData The FormData object containing the file and listName.
 * @returns A promise that resolves with the import result.
 */
export async function processImportFile(formData: FormData): Promise<ImportResult> {
  const file = formData.get('file') as File;
  const listName = formData.get('listName') as string;

  if (!file || !listName) {
      throw new Error("File and list name are required.");
  }
  
  const result: ImportResult = {
    totalRows: 0,
    unitsCreated: 0,
    errors: [],
  };

  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet) as ImportRow[];

  result.totalRows = data.length;

  let batch = writeBatch(db);
  let writeCount = 0;
  const collectionRef = collection(db, 'tsia-complex-entities');

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const rowIndex = i + 2; // Excel rows are 1-based, +1 for header
    
    try {
      // Basic validation: ensure the row is not empty
      if (Object.keys(row).length === 0) {
          result.errors.push({ rowData: row, message: 'Empty row.', row: rowIndex });
          continue;
      }
      
      const newDocRef = doc(collectionRef);
      
      const dataToSave = {
        ...row,
        type: listName, // Use the user-provided list name as the entity type
        createdAt: serverTimestamp(),
      };

      batch.set(newDocRef, dataToSave);
      writeCount++;
      result.unitsCreated++;

      // Commit batch if it's getting full to avoid hitting limits
      if (writeCount >= BATCH_LIMIT) {
        await batch.commit();
        console.log(`Committed a batch of ${writeCount} documents.`);
        batch = writeBatch(db); // Start a new batch
        writeCount = 0;
      }
    } catch (error: any) {
      result.errors.push({ rowData: row, message: error.message, row: rowIndex });
    }
  }

  // Commit any remaining writes in the last batch
  if (writeCount > 0) {
    await batch.commit();
    console.log(`Committed final batch of ${writeCount} documents.`);
  }

  return result;
}
