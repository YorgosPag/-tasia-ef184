'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Folder, Eye } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ParkingSpot {
    id: number;
    code: string;
    type: string;
    property: string;
    level: string;
    tm: number;
    price: number;
    value: number;
    valueWithVat: number;
    status: string;
    owner: string;
    holder: string;
    registeredBy: string;
}

interface EditParkingDialogProps {
    trigger: React.ReactNode;
    parkingSpot: ParkingSpot;
}

export function EditParkingDialog({ trigger, parkingSpot }: EditParkingDialogProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [filePath, setFilePath] = useState('');

    useEffect(() => {
        if(parkingSpot) {
            setFilePath(parkingSpot.holder || '');
        }
    }, [parkingSpot]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFilePath(file.name);
        }
    };

    const handleBrowseClick = () => {
        fileInputRef.current?.click();
    };
    
    if (!parkingSpot) return null;

    return (
        <Dialog>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Επεξεργασία Θέσης Στάθμευσης</DialogTitle>
                </DialogHeader>
                <ScrollArea className="max-h-[70vh] -mr-4 pr-4">
                    <div className="grid gap-4 py-4 pr-1">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label>Κωδικός</Label>
                                <Input defaultValue={parkingSpot.code} />
                            </div>
                            <div className="space-y-1">
                                <Label>Τύπος</Label>
                                <Select defaultValue={parkingSpot.type}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Υπαίθρια">Υπαίθρια</SelectItem>
                                        <SelectItem value="Σκεπαστή">Σκεπαστή</SelectItem>
                                        <SelectItem value="Υπόγεια">Υπόγεια</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <Label>Ακίνητο</Label>
                            <Select defaultValue={parkingSpot.property}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="A_D2.1">A_D2.1</SelectItem>
                                    <SelectItem value="A_D2.3">A_D2.3</SelectItem>
                                     <SelectItem value={parkingSpot.property}>{parkingSpot.property}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-1">
                                <Label>Κοινόχρηστο</Label>
                                <Select defaultValue={"no"}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="yes">Ναι</SelectItem>
                                        <SelectItem value="no">Όχι</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1">
                                <Label>Επίπεδο</Label>
                                <Select defaultValue={parkingSpot.level}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Ισόγειο">Ισόγειο</SelectItem>
                                        <SelectItem value="Υπόγειο">Υπόγειο</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label>Τ.Μ.</Label>
                                <Input type="number" defaultValue={parkingSpot.tm} />
                            </div>
                            <div className="space-y-1">
                                <Label>Τιμή</Label>
                                <Input type="number" defaultValue={parkingSpot.price} />
                            </div>
                        </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label>Αντ. Αξία</Label>
                                <Input type="number" defaultValue={parkingSpot.value} />
                            </div>
                             <div className="space-y-1">
                                <Label>Αντ. Αξία Με Συνιδιοκτησία</Label>
                                <Input type="number" defaultValue={parkingSpot.valueWithVat} />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <Label>Κάτοψη</Label>
                             <div className="flex items-center gap-2">
                               <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                               <Input className="flex-grow" readOnly value={filePath} />
                               <Button variant="outline" size="icon" onClick={handleBrowseClick}><Folder className="h-4 w-4" /></Button>
                               <Button variant="outline" size="icon"><Eye className="h-4 w-4" /></Button>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-1">
                                <Label>Κατάσταση</Label>
                                <Select defaultValue={parkingSpot.status}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Διαθέσιμο">Διαθέσιμο</SelectItem>
                                        <SelectItem value="Πουλημένο">Πουλημένο</SelectItem>
                                        <SelectItem value="Δεσμευμένο">Δεσμευμένο</SelectItem>
                                        <SelectItem value="Οικοπεδούχοι">Οικοπεδούχοι</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1">
                                <Label>Ιδιοκτήτης</Label>
                                <Input defaultValue={parkingSpot.owner} />
                            </div>
                        </div>
                    </div>
                </ScrollArea>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="outline">Άκυρο</Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button type="submit">Αποθήκευση</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
