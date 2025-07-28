
'use client';
import React from 'react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { FormItem, FormLabel, FormControl } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';

export function CapitalSection() {
    return (
        <Card className="relative border-muted">
            <CardContent className="p-6 space-y-4">
                <p className="text-sm text-muted-foreground text-center mb-4">
                🛈 Τα παρακάτω στοιχεία θα συμπληρωθούν αυτόματα από το Γ.Ε.ΜΗ. μόλις ολοκληρωθεί η σύνδεση.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-50">
                    <FormItem><FormLabel>Κεφάλαιο</FormLabel><FormControl><Input disabled placeholder="-" /></FormControl></FormItem>
                    <FormItem><FormLabel>Νόμισμα</FormLabel><FormControl><Input disabled placeholder="-" /></FormControl></FormItem>
                    <FormItem><FormLabel>Εξωλογιστικά Κεφάλαια</FormLabel><FormControl><Input disabled placeholder="-" /></FormControl></FormItem>
                    <FormItem><FormLabel>Εγγυητικά Κεφάλαια</FormLabel><FormControl><Input disabled placeholder="-" /></FormControl></FormItem>
                </div>
            </CardContent>
        </Card>
    );
}
