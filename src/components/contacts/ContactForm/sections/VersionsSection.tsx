
'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { useWatchedFields } from '../hooks/useWatchedFields';
import type { ContactFormProps } from '../types';

export function VersionsSection({ form }: Pick<ContactFormProps, 'form'>) {
    const { companyVersions } = useWatchedFields(form);

    return (
        <Card className="relative border-muted">
            <CardHeader>
                <CardTitle className="text-lg">Ιστορικό Εκδόσεων Εταιρείας</CardTitle>
                <CardDescription>
                    🛈 Οι εκδόσεις (τροποποιήσεις) της εταιρείας όπως καταγράφονται στο Γ.Ε.ΜΗ.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {companyVersions?.length > 0 ? (
                    <Table>
                        <TableHeader><TableRow><TableHead>Ημερομηνία Έκδοσης</TableHead><TableHead>Περιγραφή</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {companyVersions.map((item: any, idx: number) => (
                                <TableRow key={idx}><TableCell>{item.versionDate || "—"}</TableCell><TableCell>{item.description || "—"}</TableCell></TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-6">Δεν βρέθηκαν εκδόσεις εταιρείας.</p>
                )}
            </CardContent>
        </Card>
    );
}
