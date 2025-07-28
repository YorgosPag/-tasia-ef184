
'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/shared/components/ui/table';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';

export function DocumentsSection() {
    return (
        <Card className="relative border-muted">
             <CardHeader>
                <CardTitle className="text-lg">Έγγραφα ΓΕΜΗ</CardTitle>
                <CardDescription>
                    Τα παρακάτω έγγραφα θα αντλούνται αυτόματα από το Γ.Ε.ΜΗ. μόλις ολοκληρωθεί η σύνδεση.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h4 className="font-semibold mb-2">Έγγραφα Ανακοινώσεων (Αποφάσεις Οργάνων)</h4>
                    <div className="overflow-x-auto border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Ημ/νία</TableHead>
                                    <TableHead>Όργανο</TableHead>
                                    <TableHead>Θέμα</TableHead>
                                    <TableHead>KAK</TableHead>
                                    <TableHead>Ενέργεια</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow className="opacity-50">
                                    <TableCell><Input disabled placeholder="-" className="h-8" /></TableCell>
                                    <TableCell><Input disabled placeholder="-" className="h-8" /></TableCell>
                                    <TableCell><Input disabled placeholder="-" className="h-8" /></TableCell>
                                    <TableCell><Input disabled placeholder="-" className="h-8" /></TableCell>
                                    <TableCell><Button variant="outline" size="sm" disabled>Λήψη</Button></TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                </div>
                <div>
                    <h4 className="font-semibold mb-2">Έγγραφα Σύστασης (ΥΜΣ)</h4>
                     <div className="overflow-x-auto border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Κωδικός (ΚΑΔ)</TableHead>
                                    <TableHead>Ενέργεια</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow className="opacity-50">
                                    <TableCell><Input disabled placeholder="-" className="h-8" /></TableCell>
                                    <TableCell><Button variant="outline" size="sm" disabled>Λήψη</Button></TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
