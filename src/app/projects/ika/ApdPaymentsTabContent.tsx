
'use client';

import React from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from '@/components/ui/badge';
import { FilePlus, Banknote } from 'lucide-react';

const apdData = [
    { month: 'Ιανουάριος 2025', deadline: '10/02/2025', status: 'Εκκρεμεί' },
    { month: 'Φεβρουάριος 2025', deadline: '10/03/2025', status: 'Εκκρεμεί' },
    { month: 'Μάρτιος 2025', deadline: '10/04/2025', status: 'Εκκρεμεί' },
    { month: 'Απρίλιος 2025', deadline: '10/05/2025', status: 'Εκκρεμεί' },
];

const paymentData = [
    { month: 'Ιανουάριος 2025', amount: 3450.60, deadline: '28/02/2025', status: 'Εκκρεμεί' },
    { month: 'Φεβρουάριος 2025', amount: 3280.00, deadline: '31/03/2025', status: 'Εκκρεμεί' },
    { month: 'Μάρτιος 2025', amount: 3610.50, deadline: '30/04/2025', status: 'Εκκρεμεί' },
    { month: 'Απρίλιος 2025', amount: 3390.80, deadline: '31/05/2025', status: 'Εκκρεμεί' },
];

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('el-GR', {
        style: 'currency',
        currency: 'EUR'
    }).format(value);
};

export function ApdPaymentsTabContent() {
    return (
        <div className="space-y-6 pt-4">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Προθεσμίες Υποβολής ΑΠΔ</CardTitle>
                    <CardDescription>
                        Παρακολούθηση της κατάστασης υποβολής των Αναλυτικών Περιοδικών Δηλώσεων.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Μήνας</TableHead>
                                    <TableHead>Προθεσμία Υποβολής</TableHead>
                                    <TableHead className="text-center">Κατάσταση</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {apdData.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">{item.month}</TableCell>
                                        <TableCell>{item.deadline}</TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant={item.status === 'Εκκρεμεί' ? 'destructive' : 'secondary'}>{item.status}</Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="flex justify-end mt-4">
                        <Button>
                            <FilePlus className="mr-2 h-4 w-4" />
                            Δημιουργία Αρχείου ΑΠΔ
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Κατάσταση Πληρωμής Εισφορών</CardTitle>
                    <CardDescription>
                        Παρακολούθηση της κατάστασης πληρωμής των ασφαλιστικών εισφορών.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Μήνας</TableHead>
                                    <TableHead>Ποσό Εισφορών</TableHead>
                                    <TableHead>Προθεσμία Πληρωμής</TableHead>
                                    <TableHead className="text-center">Κατάσταση</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paymentData.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">{item.month}</TableCell>
                                        <TableCell>{formatCurrency(item.amount)}</TableCell>
                                        <TableCell>{item.deadline}</TableCell>
                                        <TableCell className="text-center">
                                             <Badge variant={item.status === 'Εκκρεμεί' ? 'destructive' : 'secondary'}>{item.status}</Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="flex justify-end mt-4">
                        <Button>
                            <Banknote className="mr-2 h-4 w-4" />
                            Καταχώρηση Πληρωμής
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
