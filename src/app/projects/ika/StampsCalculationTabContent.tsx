
'use client';

import React, { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calculator } from 'lucide-react';

const workers = [
  { id: 1, name: "ΠΑΠΑΔΟΠΟΥΛΟΣ ΙΩΑΝΝΗΣ", specialty: "Τεχνίτης", maritalStatus: "Έγγαμος", dailyWage: 65.50 },
  { id: 2, name: "ΓΕΩΡΓΙΟΥ ΑΝΑΣΤΑΣΙΟΣ", specialty: "Βοηθός Τεχνίτη", maritalStatus: "Άγαμος", dailyWage: 55.20 },
  { id: 3, name: "ΔΗΜΗΤΡΙΟΥ ΝΙΚΟΛΑΟΣ", specialty: "Εργάτης", maritalStatus: "Έγγαμος", dailyWage: 50.80 }
];

const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);
const months = [
    { value: 1, label: 'Ιανουάριος' }, { value: 2, label: 'Φεβρουάριος' },
    { value: 3, label: 'Μάρτιος' }, { value: 4, label: 'Απρίλιος' },
    { value: 5, label: 'Μάιος' }, { value: 6, label: 'Ιούνιος' },
    { value: 7, label: 'Ιούλιος' }, { value: 8, label: 'Αύγουστος' },
    { value: 9, label: 'Σεπτέμβριος' }, { value: 10, label: 'Οκτώβριος' },
    { value: 11, label: 'Νοέμβριος' }, { value: 12, label: 'Δεκέμβριος' }
];

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('el-GR', {
        style: 'currency',
        currency: 'EUR'
    }).format(value);
};

export function StampsCalculationTabContent() {
    const [selectedWorkerId, setSelectedWorkerId] = useState(workers[0].id);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [workingDays, setWorkingDays] = useState(0);

    const [results, setResults] = useState<{
        gross: number;
        employeeContrib: number;
        employerContrib: number;
        totalContrib: number;
    } | null>(null);

    const selectedWorker = useMemo(() => {
        return workers.find(w => w.id === selectedWorkerId);
    }, [selectedWorkerId]);

    const handleCalculate = () => {
        if (!selectedWorker || workingDays <= 0) {
            setResults(null);
            return;
        }

        const dailyWage = selectedWorker.dailyWage;
        const gross = dailyWage * workingDays;
        const employeeContrib = gross * 0.16820;
        const employerContrib = gross * 0.57427;
        const totalContrib = employeeContrib + employerContrib;

        setResults({
            gross,
            employeeContrib,
            employerContrib,
            totalContrib
        });
    };

    return (
        <div className="space-y-6 pt-4">
            <Card>
                 <CardHeader>
                    <div className="flex items-center gap-2">
                        <Calculator className="w-5 h-5 text-primary" />
                        <CardTitle className="text-lg">Υπολογισμός Εισφορών</CardTitle>
                    </div>
                    <CardDescription>
                        Συμπληρώστε τα παρακάτω πεδία για να υπολογίσετε τις ασφαλιστικές εισφορές.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                         <div className="space-y-2">
                            <Label>Εργατοτεχνίτης</Label>
                            <Select value={String(selectedWorkerId)} onValueChange={(v) => setSelectedWorkerId(Number(v))}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {workers.map(w => <SelectItem key={w.id} value={String(w.id)}>{w.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Έτος</Label>
                            <Select value={String(selectedYear)} onValueChange={(v) => setSelectedYear(Number(v))}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {years.map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Μήνας</Label>
                             <Select value={String(selectedMonth)} onValueChange={(v) => setSelectedMonth(Number(v))}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {months.map(m => <SelectItem key={m.value} value={String(m.value)}>{m.label}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Ημέρες Εργασίας</Label>
                            <Input type="number" value={workingDays} onChange={(e) => setWorkingDays(Number(e.target.value))} placeholder="0" />
                        </div>
                    </div>
                     <div className="flex items-end justify-between">
                         <div className="text-sm">
                            <span className="font-medium text-muted-foreground">Επιλεγμένο Ημερομίσθιο: </span>
                            <span className="font-bold text-primary">{formatCurrency(selectedWorker?.dailyWage || 0)}</span>
                        </div>
                        <Button onClick={handleCalculate}>
                            <Calculator className="mr-2 h-4 w-4" />
                            Υπολογισμός
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {results && (
                 <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Αποτελέσματα Υπολογισμού</CardTitle>
                        <CardDescription>
                            Ανάλυση εισφορών για τον {selectedWorker?.name} για {workingDays} ημέρες.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                         <div className="border rounded-md">
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="font-medium">Μικτές Αποδοχές</TableCell>
                                        <TableCell className="text-right font-semibold">{formatCurrency(results.gross)}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="pl-6">Εισφορές Εργαζομένου (16.820%)</TableCell>
                                        <TableCell className="text-right">{formatCurrency(results.employeeContrib)}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="pl-6">Εισφορές Εργοδότη (57.427%)</TableCell>
                                        <TableCell className="text-right">{formatCurrency(results.employerContrib)}</TableCell>
                                    </TableRow>
                                    <TableRow className="bg-muted/50">
                                        <TableCell className="font-medium">Σύνολο Εισφορών (74.247%)</TableCell>
                                        <TableCell className="text-right font-bold text-primary">{formatCurrency(results.totalContrib)}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

