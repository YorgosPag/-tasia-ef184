
'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/shared/components/ui/table';
import { Button } from '@/shared/components/ui/button';
import { useWatchedFields } from '../hooks/useWatchedFields';
import type { ContactFormProps } from '../types';

export function DocSummarySection({ form }: Pick<ContactFormProps, 'form'>) {
    const { docSummary } = useWatchedFields(form);

    return (
        <Card className="relative border-muted">
            <CardHeader>
                <CardTitle className="text-lg">Σύνοψη Εγγράφων ΓΕΜΗ</CardTitle>
                <CardDescription>
                    🛈 Τα παρακάτω έγγραφα αντλούνται από το Γ.Ε.ΜΗ. και δεν είναι επεξεργάσιμα.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {docSummary?.length > 0 ? (
                <Table>
                    <TableHeader><TableRow><TableHead>Τύπος</TableHead><TableHead>Ημ/νία</TableHead><TableHead>Θέμα</TableHead><TableHead>Λήψη</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {docSummary.map((doc: any, idx: number) => (
                            <TableRow key={idx}>
                            <TableCell>{doc.type || "—"}</TableCell>
                            <TableCell>{doc.date || "—"}</TableCell>
                            <TableCell>{doc.subject || "—"}</TableCell>
                            <TableCell>
                                {doc.url ? (<Button asChild variant="link" size="sm"><a href={doc.url} target="_blank" rel="noopener noreferrer">Λήψη</a></Button>) : ("—")}
                            </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                ) : (
                <p className="text-sm text-muted-foreground text-center py-6">
                    Δεν βρέθηκαν σχετικά έγγραφα.
                </p>
                )}
            </CardContent>
        </Card>
    );
}
