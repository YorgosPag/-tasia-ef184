'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format, parse } from 'date-fns';
import { Calendar as CalendarIcon, Folder, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Contract } from './types';


interface EditContractDialogProps {
    trigger: React.ReactNode;
    contract: Contract | null;
}

const parseDate = (dateString: string) => {
    if (!dateString) return undefined;
    try {
        return parse(dateString, 'd/M/yyyy', new Date());
    } catch (e) {
        return undefined;
    }
}

export function EditContractDialog({ trigger, contract }: EditContractDialogProps) {
    const [contractDate, setContractDate] = useState<Date | undefined>();
    const [transferDate, setTransferDate] = useState<Date | undefined>();
    
    const [contractPath, setContractPath] = useState('');
    const [transferPath, setTransferPath] = useState('');

    useEffect(() => {
        if(contract) {
            setContractDate(parseDate(contract.date));
            setTransferDate(parseDate(contract.transfer_date));
            setContractPath(contract.path || '');
            // Assuming the transfer path is the same as the contract path if not specified
            setTransferPath(contract.path || '');
        }
    }, [contract]);

    const contractFileInputRef = useRef<HTMLInputElement>(null);
    const transferFileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
        const file = event.target.files?.[0];
        if (file) {
            setter(file.name);
        }
    };
    
    const handleBrowseClick = (ref: React.RefObject<HTMLInputElement>) => {
        ref.current?.click();
    };

    if (!contract) return null;

    return (
        <Dialog>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Επεξεργασία Στοιχείων Συμβολαίου</DialogTitle>
                </DialogHeader>
                <ScrollArea className="max-h-[70vh] pr-4 -mr-4">
                  <div className="grid gap-6 py-4">
                      {/* Contract Details */}
                      <div className="space-y-4 p-4 border rounded-lg">
                          <h4 className="text-sm font-semibold mb-2 text-muted-foreground">Στοιχεία Συμβολαίου</h4>
                          <div className="space-y-2">
                              <Label>Τύπος Συμβολαίου</Label>
                              <Select defaultValue={contract.type}>
                                  <SelectTrigger><SelectValue placeholder="Επιλογή τύπου" /></SelectTrigger>
                                  <SelectContent>
                                      <SelectItem value="Εργολαβικό">Εργολαβικό</SelectItem>
                                      <SelectItem value="Προσύμφωνο">Προσύμφωνο</SelectItem>
                                      <SelectItem value="Αγοραπωλησία Ποσοσ">Αγοραπωλησία Ποσοστών</SelectItem>
                                      <SelectItem value="Διανομή">Διανομή</SelectItem>
                                      <SelectItem value="Πρωτόκολλο Παράδο">Πρωτόκολλο Παράδοσης</SelectItem>
                                      <SelectItem value="Μεταβίβαση Οριζόντ">Μεταβίβαση Οριζόντιας</SelectItem>
                                  </SelectContent>
                              </Select>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                  <Label>Αριθμός Συμβολαίου</Label>
                                  <Input defaultValue={contract.number} />
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
                                  <Button variant="outline" size="icon" onClick={() => handleBrowseClick(contractFileInputRef)}><Folder className="h-4 w-4" /></Button>
                                  <Button variant="outline" size="icon"><Eye className="h-4 w-4" /></Button>
                              </div>
                          </div>
                          <div className="space-y-2">
                              <Label>Συμβολαιογράφος</Label>
                              <Input defaultValue={contract.notary} />
                          </div>
                      </div>

                      {/* Transfer Details */}
                      <div className="space-y-4 p-4 border rounded-lg">
                           <h4 className="text-sm font-semibold mb-2 text-muted-foreground">Στοιχεία Μεταγραφής</h4>
                           <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                  <Label>Αριθ. Πιστοποιητικού</Label>
                                  <Input defaultValue={contract.cert_no} />
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
                              <Input defaultValue={contract.registry} />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                  <Label>Τόμος</Label>
                                  <Input defaultValue={contract.volume} />
                              </div>
                              <div className="space-y-2">
                                  <Label>Αριθμός</Label>
                                  <Input defaultValue={contract.num} />
                              </div>
                          </div>
                          <div className="space-y-2">
                              <Label>Διαδρομή Εγγράφου</Label>
                              <div className="flex items-center gap-2">
                                  <input type="file" ref={transferFileInputRef} onChange={(e) => handleFileChange(e, setTransferPath)} className="hidden" />
                                  <Input className="flex-grow" readOnly value={transferPath} />
                                  <Button variant="outline" size="icon" onClick={() => handleBrowseClick(transferFileInputRef)}><Folder className="h-4 w-4" /></Button>
                                  <Button variant="outline" size="icon"><Eye className="h-4 w-4" /></Button>
                              </div>
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
