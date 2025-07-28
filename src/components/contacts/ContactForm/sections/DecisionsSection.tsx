
'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/shared/components/ui/table';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';

export function DecisionsSection() {
    return (
        <Card className="relative border-muted">
            <CardHeader>
                <CardTitle className="text-lg">Αποφάσεις Οργάνων</CardTitle>
                <CardDescription>
                     🛈 Οι αποφάσεις οργάνων θα εμφανίζονται αυτόματα από το Γ.Ε.ΜΗ. μόλις ολοκληρωθεί η σύνδεση.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto border rounded-md opacity-50">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Ημ/νία Απόφασης</TableHead>
                                <TableHead>Όργανο</TableHead>
                                <TableHead>Θέμα</TableHead>
                                <TableHead>ΚΑΚ</TableHead>
                                <TableHead>Αρχείο</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell><Input disabled placeholder="-" className="h-8" /></TableCell>
                                <TableCell><Input disabled placeholder="-" className="h-8" /></TableCell>
                                <TableCell><Input disabled placeholder="-" className="h-8" /></TableCell>
                                <TableCell><Input disabled placeholder="-" className="h-8" /></TableCell>
                                <TableCell><Button variant="outline" size="sm" disabled>Λήψη</Button></TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
