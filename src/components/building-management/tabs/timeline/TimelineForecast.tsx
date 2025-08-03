'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { TrendingUp } from "lucide-react";

export function TimelineForecast() {
    return (
        <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5 text-green-500" />Πρόβλεψη Ολοκλήρωσης</CardTitle></CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div>
                        <div className="flex items-center justify-between mb-2"><span className="text-sm text-muted-foreground">Αρχικό χρονοδιάγραμμα</span><span className="font-medium">28/02/2009</span></div>
                        <div className="flex items-center justify-between mb-2"><span className="text-sm text-muted-foreground">Τρέχουσα πρόβλεψη</span><span className="font-medium text-orange-600">05/03/2009</span></div>
                        <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Καθυστέρηση</span><Badge variant="outline" className="bg-orange-100 text-orange-700">+5 ημέρες</Badge></div>
                    </div>
                    <Separator />
                    <div className="text-sm text-muted-foreground"><p className="mb-2">💡 <strong>Συμβουλή:</strong></p><p>Επιτάχυνση ηλ/μηχ εργασιών μπορεί να μειώσει την καθυστέρηση στις 2-3 ημέρες.</p></div>
                </div>
            </CardContent>
        </Card>
    );
}
