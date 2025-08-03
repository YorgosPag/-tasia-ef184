'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle } from "lucide-react";

export function TimelineCritical() {
    return (
        <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><AlertCircle className="w-5 h-5 text-orange-500" />Κρίσιμα Σημεία</CardTitle></CardHeader>
            <CardContent>
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/50 rounded-lg"><div><p className="font-medium text-orange-900 dark:text-orange-200">Ηλ/Μηχ Εγκαταστάσεις</p><p className="text-sm text-orange-700 dark:text-orange-300">Επηρεάζει την παράδοση</p></div><Badge variant="outline" className="bg-orange-100 text-orange-700 dark:bg-orange-800 dark:text-orange-200">5 ημέρες καθυστέρηση</Badge></div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/50 rounded-lg"><div><p className="font-medium text-yellow-900 dark:text-yellow-200">Τελικές Εργασίες</p><p className="text-sm text-yellow-700 dark:text-yellow-300">Εξαρτάται από προηγούμενο</p></div><Badge variant="outline" className="bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-200">Αναμονή</Badge></div>
                </div>
            </CardContent>
        </Card>
    );
}
