
'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, Save } from 'lucide-react';
import { cn } from '@/lib/utils';

const workers = [
  { id: 1, name: "ΠΑΠΑΔΟΠΟΥΛΟΣ ΙΩΑΝΝΗΣ" },
  { id: 2, name: "ΓΕΩΡΓΙΟΥ ΑΝΑΣΤΑΣΙΟΣ" },
  { id: 3, name: "ΔΗΜΗΤΡΙΟΥ ΝΙΚΟΛΑΟΣ" }
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

const weekDays = ['ΔΕΥ', 'ΤΡΙ', 'ΤΕΤ', 'ΠΕΜ', 'ΠΑΡ', 'ΣΑΒ', 'ΚΥΡ'];

export function TimesheetTabContent() {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedWorker, setSelectedWorker] = useState(workers[0].id);

    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    const firstDayOfMonth = new Date(selectedYear, selectedMonth - 1, 1).getDay();
    // Adjust so Monday is 0
    const startOffset = (firstDayOfMonth === 0) ? 6 : firstDayOfMonth - 1; 

    const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const emptyCells = Array.from({ length: startOffset }, (_, i) => i);


    return (
        <div className="space-y-6 pt-4">
            <Card>
                <CardHeader>
                     <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary" />
                        <CardTitle className="text-lg">Παρουσιολόγιο Εργατοτεχνίτη</CardTitle>
                    </div>
                    <CardDescription>
                        Επιλέξτε μήνα, έτος και εργατοτεχνίτη για να καταχωρήσετε τις ημέρες εργασίας.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                            <Label>Εργατοτεχνίτης</Label>
                            <Select value={String(selectedWorker)} onValueChange={(v) => setSelectedWorker(Number(v))}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {workers.map(w => <SelectItem key={w.id} value={String(w.id)}>{w.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="border rounded-lg p-4">
                        <div className="grid grid-cols-7 gap-1 text-center font-semibold text-sm text-muted-foreground mb-2">
                            {weekDays.map(day => <div key={day}>{day}</div>)}
                        </div>
                        <div className="grid grid-cols-7 gap-2">
                            {emptyCells.map(i => <div key={`empty-${i}`} className="border rounded-md h-16 bg-muted/30"></div>)}
                            {calendarDays.map(day => (
                                 <div key={day} className={cn(
                                     "border rounded-md p-2 flex flex-col items-center justify-center space-y-2 h-16",
                                     new Date(selectedYear, selectedMonth -1, day).getDay() === 0 || new Date(selectedYear, selectedMonth -1, day).getDay() === 6 ? 'bg-muted/50' : ''
                                 )}>
                                    <span className="font-semibold text-sm">{day}</span>
                                    <Checkbox id={`day-${day}`} />
                                </div>
                            ))}
                        </div>
                    </div>
                     <div className="flex justify-end">
                        <Button>
                            <Save className="mr-2 h-4 w-4" />
                            Αποθήκευση Παρουσιολογίου
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
