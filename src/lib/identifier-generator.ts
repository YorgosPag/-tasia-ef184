'use server';

import { doc, getDoc, collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Generates the next identifier for a unit based on its floor and type.
 * e.g., B1-D1, B1-D2, B2-S1
 * @param floorId The ID of the parent floor.
 * @param unitType The type of the unit (e.g., 'Διαμέρισμα', 'Στούντιο').
 * @param levelSpan The number of levels the unit spans.
 * @returns The next suggested identifier string.
 */
export async function generateNextUnitIdentifier(floorId: string, unitType: string, levelSpan: number): Promise<string> {
    const floorDocRef = doc(db, 'floors', floorId);
    const floorDoc = await getDoc(floorDocRef);
    if (!floorDoc.exists()) {
        throw new Error("Floor not found");
    }

    const buildingId = floorDoc.data().buildingId;
    const buildingDocRef = doc(db, 'buildings', buildingId);
    const buildingDoc = await getDoc(buildingDocRef);
    if (!buildingDoc.exists()) {
        throw new Error("Building not found");
    }
    
    const buildingIdentifier = buildingDoc.data().identifier || 'B';
    const floorLevel = floorDoc.data().level || 'L';
    
    let unitTypePrefix = 'U';
    if (unitType === 'Διαμέρισμα') unitTypePrefix = 'D';
    else if (unitType === 'Στούντιο') unitTypePrefix = 'S';
    else if (unitType === 'Γκαρσονιέρα') unitTypePrefix = 'G';
    else if (unitType === 'Μεζονέτα') unitTypePrefix = 'M';
    else if (unitType === 'Κατάστημα') unitTypePrefix = 'C';
    
    // Find the last identifier for this type on this floor
    const unitsQuery = query(
        collection(db, 'units'),
        where('floorIds', 'array-contains', floorId),
        where('type', '==', unitType),
        orderBy('identifier', 'desc'),
        limit(1)
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
    const levelIndicator = levelSpan > 1 ? `-${parseInt(floorLevel, 10) + levelSpan - 1}` : '';
    
    return `${buildingIdentifier}${floorLevel}${levelIndicator}${unitTypePrefix}${nextNumber}`;
}

/**
 * Generates the next identifier for an attachment (parking/storage).
 * e.g., B1D1-P1, B1D1-S1
 * @param unitId The ID of the parent unit.
 * @param attachmentType 'parking' or 'storage'.
 * @returns The next suggested identifier string.
 */
export async function generateNextAttachmentIdentifier(unitId: string, attachmentType: 'parking' | 'storage'): Promise<string> {
     const unitDocRef = doc(db, 'units', unitId);
    const unitDoc = await getDoc(unitDocRef);
    if (!unitDoc.exists()) {
        throw new Error("Unit not found");
    }

    const unitIdentifier = unitDoc.data().identifier;
    const attachmentPrefix = attachmentType === 'parking' ? 'P' : 'S';
    
    const attachmentsQuery = query(
        collection(db, 'attachments'),
        where('unitId', '==', unitId),
        where('type', '==', attachmentType),
        orderBy('identifier', 'desc'),
        limit(1)
    );

    const snapshot = await getDocs(attachmentsQuery);
    let lastNumber = 0;
    if(!snapshot.empty) {
        const lastIdentifier = snapshot.docs[0].data().identifier;
        const match = lastIdentifier.match(/-[PS](\d+)$/);
        if (match) {
            lastNumber = parseInt(match[1], 10);
        }
    }
    
    const nextNumber = lastNumber + 1;
    return `${unitIdentifier}-${attachmentPrefix}${nextNumber}`;
}
