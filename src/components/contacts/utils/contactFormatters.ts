
'use client';

import { format } from 'date-fns';
import { Timestamp } from 'firebase/firestore';

export const formatDate = (date: any) => {
    if (!date) return null;
    try {
        const d = date.toDate ? date.toDate() : new Date(date);
        return format(d, 'dd/MM/yyyy');
    } catch {
        return null;
    }
}
