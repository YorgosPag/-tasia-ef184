
'use an strict';

import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';

export type ActionType = 
    | 'CREATE_COMPANY' | 'UPDATE_COMPANY' | 'DELETE_COMPANY'
    | 'CREATE_PROJECT' | 'UPDATE_PROJECT' | 'DELETE_PROJECT'
    | 'CREATE_BUILDING' | 'UPDATE_BUILDING' | 'DELETE_BUILDING'
    | 'CREATE_FLOOR' | 'UPDATE_FLOOR' | 'DELETE_FLOOR'
    | 'CREATE_UNIT' | 'UPDATE_UNIT' | 'DELETE_UNIT'
    | 'CREATE_ATTACHMENT' | 'UPDATE_ATTACHMENT' | 'DELETE_ATTACHMENT'
    | 'UPLOAD_FLOORPLAN' | 'UPDATE_UNIT_POLYGON';

export interface LogDetails {
    entityId: string;
    entityType: 'company' | 'project' | 'building' | 'floor' | 'unit' | 'attachment' | 'floorplan';
    changes?: Record<string, any>;
    [key: string]: any; // for additional context
}

/**
 * Logs an activity to the 'auditLogs' collection in Firestore.
 * @param {ActionType} action - The type of action performed.
 * @param {LogDetails} details - An object containing details about the event.
 */
export const logActivity = async (action: ActionType, details: LogDetails) => {
    try {
        const user = auth.currentUser;
        if (!user) {
            console.warn('Cannot log activity: User is not authenticated.');
            return;
        }

        const logEntry = {
            action,
            ...details,
            userId: user.uid,
            userEmail: user.email,
            timestamp: serverTimestamp(),
        };

        await addDoc(collection(db, 'auditLogs'), logEntry);
    } catch (error) {
        console.error('Failed to write to audit log:', error);
    }
};
