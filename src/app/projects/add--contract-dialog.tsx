
'use client';

import React, { useRef, useState } from 'react';
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Folder, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AddContractDialogProps {
    trigger: React.ReactNode;
}

export function AddContractDialog({ trigger }: AddContractDialogProps) {
    const [contractDate, setContractDate] = useState<Date | undefined>();
    const [transferDate, setTransferDate] = useState<Date | undefined>();
    
    const [contractPath, setContractPath] = useState('');
    const [transferPath, setTransferPath] = useState('');

    const contractFileInputRef = useRef<HTMLInputElement>(null);
    const transferFileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
        const file = event.target.files?.[0];
        if (file) {
            setter(file.name);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Στοιχεία Συμβολαίου</DialogTitle>
                </DialogHeader>
                <ScrollArea className="max-h-[70vh] pr-4 -mr-4">
                  <div className="grid gap-6 py-4">
                      {/* Contract Details */}
                      <div className="space-y-4 p-4 border rounded-lg">
                          <h4 className="text-sm font-semibold mb-2 text-muted-foreground">Στοιχεία Συμβολαίου</h4>
                          <div className="space-y-2">
                              <Label>Τύπος Συμβολαίου</Label>
                              <Select>
                                  <SelectTrigger><SelectValue placeholder="Επιλογή τύπου" /></SelectTrigger>
                                  <SelectContent>
                                      <SelectItem value="ergolaviko">Εργολαβικό</SelectItem>
                                      <SelectItem value="prosymfono">Προσύμφωνο</SelectItem>
                                      <SelectItem value="agorapolisia">Αγοραπωλησία Ποσοστών</SelectItem>
                                  </SelectContent>
                              </Select>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                  <Label>Αριθμός Συμβολαίου</Label>
                                  <Input />
                              </div>
                              <div className="space-y-2">
                                  <Label>Ημερ. Συμβολαίου</Label>
                                  <Popover>
                                      <PopoverTrigger asChild>
                                          <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !contractDate && "text-muted-foreground")}>
                                              <CalendarIcon className="mr-2 h-4 w-4" />
                                              {contractDate ? format(contractDate, "d / M / yyyy") : <span>Επιλογή ημερομηνίας</span>}
                                          </Button>
                                      </PopoverTrigger>
                                      <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={contractDate} onSelect={setContractDate} initialFocus /></PopoverContent>
                                  </Popover>
                              </div>
                          </div>
                          <div className="space-y-2">
                              <Label>Αρχείο Συμβολαίου</Label>
                              <div className="flex items-center gap-2">
                                  <input type="file" ref={contractFileInputRef} onChange={(e) => handleFileChange(e, setContractPath)} className="hidden" />
                                  <Input className="flex-grow" readOnly value={contractPath} />
                                  <Button variant="outline" size="icon" onClick={() => contractFileInputRef.current?.click()}><Folder className="h-4 w-4" /></Button>
                                  <Button variant="outline" size="icon"><Eye className="h-4 w-4" /></Button>
                              </div>
                          </div>
                          <div className="space-y-2">
                              <Label>Συμβολαιογράφος</Label>
                              <Input />
                          </div>
                      </div>

                      {/* Transfer Details */}
                      <div className="space-y-4 p-4 border rounded-lg">
                           <h4 className="text-sm font-semibold mb-2 text-muted-foreground">Στοιχεία Μεταγραφής</h4>
                           <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                  <Label>Αριθ. Πιστοποιητικού</Label>
                                  <Input />
                              </div>
                              <div className="space-y-2">
                                  <Label>Ημερ. Μεταγραφής</Label>
                                  <Popover>
                                      <PopoverTrigger asChild>
                                          <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !transferDate && "text-muted-foreground")}>
                                              <CalendarIcon className="mr-2 h-4 w-4" />
                                              {transferDate ? format(transferDate, "d / M / yyyy") : <span>Επιλογή ημερομηνίας</span>}
                                          </Button>
                                      </PopoverTrigger>
                                      <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={transferDate} onSelect={setTransferDate} initialFocus /></PopoverContent>
                                  </Popover>
                              </div>
                          </div>
                           <div className="space-y-2">
                              <Label>Υποθηκοφυλακείο</Label>
                              <Input />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                  <Label>Τόμος</Label>
                                  <Input />
                              </div>
                              <div className="space-y-2">
                                  <Label>Αριθμός</Label>
                                  <Input />
                              </div>
                          </div>
                          <div className="space-y-2">
                              <Label>Διαδρομή Εγγράφου</Label>
                              <div className="flex items-center gap-2">
                                  <input type="file" ref={transferFileInputRef} onChange={(e) => handleFileChange(e, setTransferPath)} className="hidden" />
                                  <Input className="flex-grow" readOnly value={transferPath} />
                                  <Button variant="outline" size="icon" onClick={() => transferFileInputRef.current?.click()}><Folder className="h-4 w-4" /></Button>
                                  <Button variant="outline" size="icon"><Eye className="h-4 w-4" /></Button>
                              </div>
                          </div>
                      </div>
                  </div>
                </ScrollArea>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button">OK</Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button type="button" variant="outline">Άκυρο</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
