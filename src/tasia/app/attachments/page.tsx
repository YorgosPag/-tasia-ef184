'use client';

import React from 'react';
import { AttachmentsListTable } from '@/tasia/components/attachments/AttachmentsListTable';

// Dummy data and types for display purposes
export interface Unit {
  id: string;
  name: string;
  identifier: string;
}

export interface Attachment {
  id: string;
  type: string;
  details?: string;
  unitId?: string;
  isStandalone?: boolean;
  isBundle?: boolean;
}

export default function AttachmentsPage() {
    // In a real app, this data would come from a hook or API call.
  const attachments: Attachment[] = [];
  const unitsMap = new Map<string, Unit>();

  const handleEdit = (attachment: Attachment) => {
      alert(`Editing ${attachment.details}`);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Όλα τα Παρακολουθήματα</h1>
      <AttachmentsListTable 
        attachments={attachments} 
        unitsMap={unitsMap} 
        onEdit={handleEdit} 
      />
    </div>
  );
}
