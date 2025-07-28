
'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/shared/components/ui/table';
import { useWatchedFields } from '../hooks/useWatchedFields';
import type { ContactFormProps } from '../types';

export function StatusesSection({ form }: Pick<ContactFormProps, 'form'>) {
    const { statuses } = useWatchedFields(form);

    return (
        <Card className="relative border-muted">
            <CardHeader>
                <CardTitle className="text-lg">Ιστορικό Καταστάσεων ΓΕΜΗ</CardTitle>
                <CardDescription>
                    🛈 Οι καταστάσεις της εταιρείας όπως καταγράφονται στο Γ.Ε.ΜΗ.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {statuses?.length > 0 ? (
                    <Table>
                        <TableHeader><TableRow><TableHead>Κατάσταση</TableHead><TableHead>Ημερομηνία</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {statuses.map((item: any, idx: number) => (
                                <TableRow key={idx}><TableCell>{item.status || "—"}</TableCell><TableCell>{item.statusDate || "—"}</TableCell></TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-6">Δεν βρέθηκαν διαθέσιμες καταστάσεις.</p>
                )}
            </CardContent>
        </Card>
    );
}
