'use client';

import React from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';
import { AttachmentsListTable } from '@/tasia/components/attachments/AttachmentsListTable';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

// --- Type Definitions ---
// It's better to define types within the file that uses them if they aren't shared.
export interface Attachment {
  id: string;
  type: 'parking' | 'storage';
  details?: string;
  unitId?: string;
  isBundle?: boolean;
  isStandalone?: boolean;
}

export interface Unit {
  id: string;
  name: string;
  identifier: string;
}

// --- Data Fetching Function ---
async function fetchAllData(): Promise<{ attachments: Attachment[]; unitsMap: Map<string, Unit> }> {
    const attachmentsQuery = query(collection(db, 'attachments'));
    const unitsQuery = query(collection(db, 'units'));

    // Use Promise.all to fetch both collections in parallel
    const [attachmentsSnapshot, unitsSnapshot] = await Promise.all([
        getDocs(attachmentsQuery),
        getDocs(unitsQuery),
    ]);

    const attachments = attachmentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Attachment));
    
    const unitsMap = new Map<string, Unit>();
    unitsSnapshot.docs.forEach(doc => {
        unitsMap.set(doc.id, { id: doc.id, ...doc.data() } as Unit);
    });

    return { attachments, unitsMap };
}

// --- Page Component ---
export default function AttachmentsPage() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['allAttachmentsAndUnits'],
        queryFn: fetchAllData,
        // Keep data fresh for a minute, then refetch in the background
        staleTime: 1000 * 60,
    });

    const handleEdit = (attachment: Attachment) => {
        // In a real app, this would open a dialog/modal for editing.
        alert(`Editing ${attachment.details}`);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (error) {
        return <div className="text-destructive p-4 rounded-md border border-destructive/50 bg-destructive/10">Σφάλμα κατά τη φόρτωση δεδομένων: {(error as Error).message}</div>;
    }

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-bold">Όλα τα Παρακολουθήματα</h1>
            <AttachmentsListTable
                attachments={data?.attachments || []}
                unitsMap={data?.unitsMap || new Map()}
                onEdit={handleEdit}
            />
        </div>
    );
}
