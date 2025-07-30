
'use strict';

import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';

export type ActionType =
  | 'CREATE_LIST'
  | 'UPDATE_LIST'
  | 'DELETE_LIST'
  | 'ADD_LIST_ITEM'
  | 'UPDATE_LIST_ITEM'
  | 'DELETE_LIST_ITEM'
  | 'CREATE_COMPANY'
  | 'UPDATE_COMPANY'
  | 'DELETE_COMPANY'
  | 'DUPLICATE_COMPANY'
  | 'CREATE_PROJECT'
  | 'UPDATE_PROJECT'
  | 'DELETE_PROJECT'
  | 'DUPLICATE_PROJECT'
  | 'CREATE_BUILDING'
  | 'UPDATE_BUILDING'
  | 'DELETE_BUILDING'
  | 'DUPLICATE_BUILDING'
  | 'CREATE_FLOOR'
  | 'UPDATE_FLOOR'
  | 'DELETE_FLOOR'
  | 'DUPLICATE_FLOOR'
  | 'CREATE_UNIT'
  | 'UPDATE_UNIT'
  | 'DELETE_UNIT'
  | 'DUPLICATE_UNIT'
  | 'CREATE_ATTACHMENT'
  | 'UPDATE_ATTACHMENT'
  | 'DELETE_ATTACHMENT'
  | 'ASSIGN_ATTACHMENT'
  | 'UNASSIGN_ATTACHMENT'
  | 'UPLOAD_FLOORPLAN'
  | 'UPDATE_UNIT_POLYGON'
  | 'UPDATE_USER_ROLE'
  | 'CREATE_WORK_STAGE'
  | 'UPDATE_WORK_STAGE'
  | 'DELETE_WORK_STAGE'
  | 'CREATE_WORK_SUBSTAGE'
  | 'UPDATE_WORK_SUBSTAGE'
  | 'DELETE_WORK_SUBSTAGE'
  | 'SEED_DATA'
  | 'CLEAR_DATA'
  | 'CREATE_CONTACT'
  | 'UPDATE_CONTACT';

export interface LogDetails {
  entityId?: string;
  entityType?:
    | 'custom-list'
    | 'company'
    | 'project'
    | 'building'
    | 'floor'
    | 'unit'
    | 'attachment'
    | 'floorplan'
    | 'user'
    | 'workStage'
    | 'workSubstage'
    | 'database'
    | 'contact';
  changes?: Record<string, any>;
  projectId?: string; // Added to filter activity by project
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
