
'use server';

import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore';
import { db } from './firebase';

// --- Type Definitions ---

interface Unit {
  id: string;
  identifier: string; // The hierarchical code
  type?: string;
  floorIds: string[];
  levelSpan?: string;
}

interface Attachment {
  id:string;
  identifier: string;
  unitId: string;
  type: 'parking' | 'storage';
}

interface Floor {
    level: string; // "1", "Ι", "Π"
    buildingId: string;
}
interface Building {
    identifier: string; // "A", "B", "W1"
    projectId: string;
}

// --- Helper Functions ---

/**
 * Maps a full unit type string to its corresponding code.
 * @param typeString The full type string (e.g., "Διαμέρισμα").
 * @returns The single-letter code (e.g., "D").
 */
function getUnitTypeCode(typeString?: string): string {
    if (!typeString) return 'U'; // U for Unknown/Unit
    const typeLower = typeString.toLowerCase();
    if (typeLower.startsWith('διαμέρισμα')) return 'D';
    if (typeLower.startsWith('στούντιο')) return 'S';
    if (typeLower.startsWith('γκαρσονιέρα')) return 'G';
    if (typeLower.startsWith('μεζονέτα')) return 'M';
    if (typeLower.startsWith('κατάστημα')) return 'K';
    return 'O'; // O for Other
}

/**
 * Fetches all units for a specific floor to determine the next available number.
 * @param floorId The Firestore ID of the floor.
 * @returns A promise that resolves to an array of existing units on that floor.
 */
async function getUnitsForFloor(floorId: string): Promise<Unit[]> {
    const unitsQuery = query(collection(db, 'units'), where('floorIds', 'array-contains', floorId));
    const snapshot = await getDocs(unitsQuery);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Unit));
}

/**
 * Fetches all attachments for a specific unit.
 * @param unitId The Firestore ID of the unit.
 * @returns A promise that resolves to an array of existing attachments for that unit.
 */
async function getAttachmentsForUnit(unitId: string): Promise<Attachment[]> {
    const attachmentsQuery = query(collection(db, 'attachments'), where('unitId', '==', unitId));
    const snapshot = await getDocs(attachmentsQuery);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Attachment));
}


// --- Core Generator Functions ---

/**
 * Generates the next available identifier for a new unit on a specific floor.
 * @param floorId The ID of the floor where the unit will be created.
 * @param unitType The type of the unit (e.g., "Διαμέρισμα").
 * @param floorSpan The number of floors the unit spans (for mezzanines, etc.).
 * @returns A promise that resolves to the suggested unique identifier string.
 */
export async function generateNextUnitIdentifier(floorId: string, unitType: string, floorSpan: number = 1): Promise<string> {
    if (!floorId) throw new Error("Floor ID is required to generate a unit identifier.");

    // 1. Fetch parent entities to build the prefix
    const floorDoc = await getDoc(doc(db, 'floors', floorId));
    if (!floorDoc.exists()) throw new Error(`Floor with ID ${floorId} not found.`);
    const floorData = floorDoc.data() as Floor;

    const buildingDoc = await getDoc(doc(db, 'buildings', floorData.buildingId));
    if (!buildingDoc.exists()) throw new Error(`Building with ID ${floorData.buildingId} not found.`);
    const buildingData = buildingDoc.data() as Building;

    const buildingCode = buildingData.identifier || 'X'; // Fallback to 'X'
    const floorCode = floorData.level || '0';
    const typeCode = getUnitTypeCode(unitType);

    // 2. Fetch existing units on the same floor to find the next number
    const existingUnits = await getUnitsForFloor(floorId);
    
    // Filter units of the same type to find the max number
    const unitsOfType = existingUnits.filter(u => {
        const existingTypeCode = getUnitTypeCode(u.type);
        return existingTypeCode === typeCode;
    });
    
    // Extract numbers from identifiers (e.g., from 'B2D3', extract '3')
    const existingNumbers = unitsOfType.map(u => {
        const match = u.identifier.match(new RegExp(`${typeCode}(\\d+)`));
        return match ? parseInt(match[1], 10) : 0;
    });

    const nextNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;

    // 3. Construct the final identifier
    let identifier = `${buildingCode}${floorCode}${typeCode}${nextNumber}`;
    if (floorSpan > 1) {
        identifier += `-${floorSpan}F`;
    }

    return identifier;
}


/**
 * Generates the next available identifier for a new attachment for a specific unit.
 * @param unitId The ID of the parent unit.
 * @param attachmentType The type of attachment ('parking' or 'storage').
 * @returns A promise that resolves to the suggested unique identifier string.
 */
export async function generateNextAttachmentIdentifier(unitId: string, attachmentType: 'parking' | 'storage'): Promise<string> {
    if (!unitId) throw new Error("Unit ID is required to generate an attachment identifier.");

    // 1. Fetch parent unit to get its identifier
    const unitDoc = await getDoc(doc(db, 'units', unitId));
    if (!unitDoc.exists()) throw new Error(`Unit with ID ${unitId} not found.`);
    const unitData = unitDoc.data() as Unit;
    const unitIdentifier = unitData.identifier;

    // 2. Determine attachment code
    const attachmentCode = attachmentType === 'parking' ? 'P' : 'S';

    // 3. Fetch existing attachments of the same type for this unit
    const existingAttachments = await getAttachmentsForUnit(unitId);
    const attachmentsOfType = existingAttachments.filter(att => att.type === attachmentType);

    const nextNumber = attachmentsOfType.length + 1;

    // 4. Construct final identifier
    return `${unitIdentifier}${attachmentCode}${nextNumber}`;
}
