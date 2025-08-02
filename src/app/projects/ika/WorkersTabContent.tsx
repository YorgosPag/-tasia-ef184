
'use client';

import React, { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { UserPlus, Pencil, Trash2 } from 'lucide-react';

const WAGE_RATES = {
    'technician': { 'single': 41.00, 'married': 45.10 },
    'assistant': { 'single': 38.00, 'married': 41.80 },
    'worker': { 'single': 35.00, 'married': 38.50 },
};

const workers = [
  { id: 1, name: "ΠΑΠΑΔΟΠΟΥΛΟΣ ΙΩΑΝΝΗΣ", specialty: "technician", maritalStatus: "married", trienniums: "0-6", afm: "123456789", dailyWage: 45.10 },
  { id: 2, name: "ΓΕΩΡΓΙΟΥ ΑΝΑΣΤΑΣΙΟΣ", specialty: "assistant", maritalStatus: "single", trienniums: "0-6", afm: "987654321", dailyWage: 38.00 },
  { id: 3, name: "ΔΗΜΗΤΡΙΟΥ ΝΙΚΟΛΑΟΣ", specialty: "worker", maritalStatus: "married", trienniums: "0-6", afm: "112233445", dailyWage: 38.50 },
  { id: 4, name: "ΑΝΤΩΝΙΟΥ ΕΛΕΝΗ", specialty: "technician", maritalStatus: "single", trienniums: "0-6", afm: "223344556", dailyWage: 41.00 },
  { id: 5, name: "ΚΩΝΣΤΑΝΤΙΝΟΥ ΜΑΡΙΑ", specialty: "worker", maritalStatus: "single", trienniums: "0-6", afm: "334455667", dailyWage: 35.00 },
  { id: 6, name: "ΒΑΣΙΛΕΙΟΥ ΠΕΤΡΟΣ", specialty: "assistant", maritalStatus: "married", trienniums: "0-6", afm: "445566778", dailyWage: 41.80 },
];

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('el-GR', {
        style: 'currency',
        currency: 'EUR'
    }).format(value);
};


export function WorkersTabContent() {
    const [specialty, setSpecialty] = useState<keyof typeof WAGE_RATES | ''>('');
    const [maritalStatus, setMaritalStatus] = useState<keyof typeof WAGE_RATES['technician'] | ''>('');

    const calculatedWage = useMemo(() => {
        if (specialty && maritalStatus) {
            return WAGE_RATES[specialty][maritalStatus];
        }
        return 0;
    }, [specialty, maritalStatus]);


    return (
        <div className="space-y-6 pt-4">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <UserPlus className="w-5 h-5 text-primary" />
                        <CardTitle className="text-lg">Προσθήκη / Επεξεργασία Εργατοτεχνίτη</CardTitle>
                    </div>
                    <CardDescription>
                        Συμπληρώστε τα στοιχεία του εργατοτεχνίτη για να τον προσθέσετε στο έργο.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Όνομα/Επωνυμία</Label>
                            <Input id="name" placeholder="Εισάγετε το ονοματεπώνυμο" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="afm">ΑΦΜ</Label>
                            <Input id="afm" placeholder="Εισάγετε το ΑΦΜ" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="specialty">Ειδικότητα</Label>
                            <Select onValueChange={(value) => setSpecialty(value as keyof typeof WAGE_RATES)}>
                                <SelectTrigger id="specialty">
                                    <SelectValue placeholder="Επιλογή ειδικότητας" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="technician">Τεχνίτης</SelectItem>
                                    <SelectItem value="assistant">Βοηθός Τεχνίτη</SelectItem>
                                    <SelectItem value="worker">Εργάτης</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="marital-status">Οικογενειακή Κατάσταση</Label>
                            <Select onValueChange={(value) => setMaritalStatus(value as keyof typeof WAGE_RATES['technician'])}>
                                <SelectTrigger id="marital-status">
                                    <SelectValue placeholder="Επιλογή κατάστασης" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="single">Άγαμος</SelectItem>
                                    <SelectItem value="married">Έγγαμος</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="trienniums">Τριετίες</Label>
                            <Select>
                                <SelectTrigger id="trienniums">
                                    <SelectValue placeholder="Επιλογή τριετιών" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="0-6">0-6 τριετίες</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="calculated-wage">Υπολογιζόμενο Ημερομίσθιο</Label>
                            <Input id="calculated-wage" readOnly value={formatCurrency(calculatedWage)} className="font-semibold text-primary focus:ring-green-500" />
                        </div>
                    </div>
                    <div className="flex justify-end pt-2">
                        <Button>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Προσθήκη Εργατοτεχνίτη
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Λίστα Εργατοτεχνιτών</CardTitle>
                    <CardDescription>
                        Οι εργατοτεχνίτες που έχουν καταχωρηθεί στο έργο.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                     <div className="border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Όνομα/Επωνυμία</TableHead>
                                    <TableHead>ΑΦΜ</TableHead>
                                    <TableHead>Ειδικότητα</TableHead>
                                    <TableHead>Οικ. Κατάσταση</TableHead>
                                    <TableHead>Τριετίες</TableHead>
                                    <TableHead className="text-right">Ημερομίσθιο</TableHead>
                                    <TableHead className="text-center">Ενέργειες</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {workers.map((worker) => (
                                    <TableRow key={worker.id}>
                                        <TableCell className="font-medium">{worker.name}</TableCell>
                                        <TableCell>{worker.afm}</TableCell>
                                        <TableCell>{worker.specialty === 'technician' ? 'Τεχνίτης' : worker.specialty === 'assistant' ? 'Βοηθός' : 'Εργάτης'}</TableCell>
                                        <TableCell>{worker.maritalStatus === 'married' ? 'Έγγαμος' : 'Άγαμος'}</TableCell>
                                        <TableCell>{worker.trienniums}</TableCell>
                                        <TableCell className="text-right">{formatCurrency(worker.dailyWage)}</TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <Pencil className="h-4 w-4 text-blue-600" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <Trash2 className="h-4 w-4 text-red-600" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
