'use client';

import React, { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Folder, Eye } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AddParkingDialogProps {
    trigger: React.ReactNode;
}

export function AddParkingDialog({ trigger }: AddParkingDialogProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [filePath, setFilePath] = useState('');

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFilePath(file.name);
        }
    };

    const handleBrowseClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <Dialog>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Προσθήκη Θέσης Στάθμευσης</DialogTitle>
                </DialogHeader>
                <ScrollArea className="max-h-[70vh] -mr-4 pr-4">
                    <div className="grid gap-4 py-4 pr-1">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label>Κωδικός</Label>
                                <Input />
                            </div>
                            <div className="space-y-1">
                                <Label>Τύπος</Label>
                                <Select>
                                    <SelectTrigger><SelectValue placeholder="Επιλογή..." /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="outdoor">Υπαίθρια</SelectItem>
                                        <SelectItem value="indoor">Σκεπαστή</SelectItem>
                                        <SelectItem value="underground">Υπόγεια</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <Label>Ακίνητο</Label>
                            <Select>
                                <SelectTrigger><SelectValue placeholder="Επιλογή ακινήτου..." /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="a_d2.1">A_D2.1</SelectItem>
                                    <SelectItem value="a_d2.3">A_D2.3</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-1">
                                <Label>Κοινόχρηστο</Label>
                                <Select>
                                    <SelectTrigger><SelectValue placeholder="Επιλογή..." /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="yes">Ναι</SelectItem>
                                        <SelectItem value="no">Όχι</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1">
                                <Label>Επίπεδο</Label>
                                <Select>
                                    <SelectTrigger><SelectValue placeholder="Επιλογή..." /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ground">Ισόγειο</SelectItem>
                                        <SelectItem value="underground">Υπόγειο</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label>Τ.Μ.</Label>
                                <Input type="number" />
                            </div>
                            <div className="space-y-1">
                                <Label>Τιμή</Label>
                                <Input type="number" />
                            </div>
                        </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label>Αντ. Αξία</Label>
                                <Input type="number" />
                            </div>
                             <div className="space-y-1">
                                <Label>Αντ. Αξία Με Συνιδιοκτησία</Label>
                                <Input type="number" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <Label>Κάτοψη</Label>
                             <div className="flex items-center gap-2">
                               <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                               <Input className="flex-grow" readOnly value={filePath} placeholder="Επιλέξτε αρχείο..." />
                               <Button variant="outline" size="icon" onClick={handleBrowseClick}><Folder className="h-4 w-4" /></Button>
                               <Button variant="outline" size="icon"><Eye className="h-4 w-4" /></Button>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-1">
                                <Label>Κατάσταση</Label>
                                <Select>
                                    <SelectTrigger><SelectValue placeholder="Επιλογή..." /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="available">Διαθέσιμο</SelectItem>
                                        <SelectItem value="sold">Πουλημένο</SelectItem>
                                        <SelectItem value="reserved">Δεσμευμένο</SelectItem>
                                        <SelectItem value="landowner">Οικοπεδούχοι</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1">
                                <Label>Ιδιοκτήτης</Label>
                                <Input />
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
