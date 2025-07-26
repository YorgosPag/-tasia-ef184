'use client';

import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';
import { AttachmentsListTable } from '@/tasia/components/attachments/AttachmentsListTable';
import type { Attachment, Unit } from '@/tasia/app/attachments/page';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

async function fetchAllData(): Promise<{ attachments: Attachment[]; unitsMap: Map<string, Unit> }> {
    const attachmentsQuery = query(collection(db, 'attachments'));
    const unitsQuery = query(collection(db, 'units'));

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

export default function AttachmentsPage() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['allAttachmentsAndUnits'],
        queryFn: fetchAllData,
    });

    const handleEdit = (attachment: Attachment) => {
        alert(`Editing ${attachment.details}`);
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    if (error) {
        return <div className="text-destructive">Σφάλμα κατά τη φόρτωση δεδομένων.</div>;
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
