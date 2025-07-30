
'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { useWatchedFields } from '../hooks/useWatchedFields';
import type { ContactFormProps } from '../types';

export function BranchesSection({ form }: Pick<ContactFormProps, 'form'>) {
    const { branches } = useWatchedFields(form);

    return (
        <Card className="relative border-muted">
            <CardHeader>
                <CardTitle className="text-lg">Καταστήματα / Υποκαταστήματα</CardTitle>
                <CardDescription>🛈 Τα παρακάτω στοιχεία αντλούνται από το Γ.Ε.ΜΗ. και θα συμπληρωθούν αυτόματα μόλις ολοκληρωθεί η σύνδεση.</CardDescription>
            </CardHeader>
            <CardContent>
                {branches?.length > 0 ? (
                    <Table>
                        <TableHeader><TableRow><TableHead>Οδός</TableHead><TableHead>Αρ.</TableHead><TableHead>Τ.Κ.</TableHead><TableHead>Δήμος</TableHead><TableHead>Κατάσταση</TableHead><TableHead>Ημ/νία Σύστασης</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {branches.map((b: any, idx: number) => (
                                <TableRow key={idx}>
                                    <TableCell>{b.address || "—"}</TableCell>
                                    <TableCell>{b.number || "—"}</TableCell>
                                    <TableCell>{b.postalCode || "—"}</TableCell>
                                    <TableCell>{b.municipality || "—"}</TableCell>
                                    <TableCell>{b.status || "—"}</TableCell>
                                    <TableCell>{b.established || "—"}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-6">Δεν βρέθηκαν υποκαταστήματα.</p>
                )}
            </CardContent>
        </Card>
    );
}
