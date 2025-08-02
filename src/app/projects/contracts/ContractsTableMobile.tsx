'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Contract } from './types';

interface ContractsTableMobileProps {
  contracts: Contract[];
  selectedContract: Contract | null;
  onSelectContract: (doc: Contract) => void;
}

export function ContractsTableMobile({ contracts, selectedContract, onSelectContract }: ContractsTableMobileProps) {
  return (
    <ScrollArea className="h-full">
      <div className="space-y-2 p-2">
        {contracts.map((contract) => (
          <Card
            key={contract.id}
            onClick={() => onSelectContract(contract)}
            className={cn('cursor-pointer', selectedContract?.id === contract.id && 'border-primary')}
          >
            <CardContent className="p-3 text-xs space-y-1">
              <div className="flex justify-between font-bold">
                <p className="truncate pr-2">{contract.type} #{contract.number}</p>
                <p className="text-muted-foreground whitespace-nowrap">{contract.date}</p>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                 <div><span className="font-medium text-muted-foreground">Συμβ/φος:</span> {contract.notary || "-"}</div>
                 <div><span className="font-medium text-muted-foreground">Ημερ. Μετ:</span> {contract.transfer_date || "-"}</div>
                 <div className="col-span-2 truncate"><span className="font-medium text-muted-foreground">Αρχείο:</span> {contract.path}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
