
'use client';

import React, { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Folder, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AddMiscellaneousDocumentDialogProps {
    trigger: React.ReactNode;
}

export function AddMiscellaneousDocumentDialog({ trigger }: AddMiscellaneousDocumentDialogProps) {
    const [docDate, setDocDate] = useState<Date | undefined>();
    const [filePath, setFilePath] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

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
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Προσθήκη Εγγράφου</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-1">
                        <Label>Περιγραφή Εγγράφου</Label>
                        <Input />
                    </div>
                    <div className="space-y-1">
                        <Label>Αριθμός Εγγράφου</Label>
                        <Input />
                    </div>
                    <div className="space-y-1">
                        <Label>Ημερ. Εγγράφου</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !docDate && "text-muted-foreground")}>
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {docDate ? format(docDate, "d / M / yyyy") : <span>Επιλογή ημερομηνίας</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={docDate} onSelect={setDocDate} initialFocus /></PopoverContent>
                        </Popover>
                    </div>
                     <div className="space-y-1">
                        <Label>Αρχείο Εγγράφου</Label>
                        <div className="flex items-center gap-2">
                           <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                           <Input className="flex-grow" readOnly value={filePath} placeholder="Επιλέξτε αρχείο..." />
                           <Button variant="outline" size="icon" onClick={handleBrowseClick}><Folder className="h-4 w-4" /></Button>
                           <Button variant="outline" size="icon"><Eye className="h-4 w-4" /></Button>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <Label>Καταχωρήθηκε Από</Label>
                        <Input />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="outline">Άκυρο</Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button type="submit">OK</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
