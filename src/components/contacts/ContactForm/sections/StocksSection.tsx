
'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { FormItem, FormLabel, FormControl } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';

export function StocksSection() {
    return (
        <Card className="relative border-muted">
             <CardHeader>
                <CardTitle className="text-lg">Μετοχική Σύνθεση</CardTitle>
                <CardDescription>
                    🛈 Τα στοιχεία της μετοχικής σύνθεσης θα συμπληρωθούν αυτόματα από το Γ.Ε.ΜΗ. μόλις ολοκληρωθεί η σύνδεση.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-50">
                    <FormItem><FormLabel>Τύπος Μετοχής</FormLabel><FormControl><Input disabled placeholder="-" /></FormControl></FormItem>
                    <FormItem><FormLabel>Ποσότητα</FormLabel><FormControl><Input disabled placeholder="-" /></FormControl></FormItem>
                    <FormItem><FormLabel>Ονομαστική Τιμή</FormLabel><FormControl><Input disabled placeholder="-" /></FormControl></FormItem>
                </div>
            </CardContent>
        </Card>
    );
}
