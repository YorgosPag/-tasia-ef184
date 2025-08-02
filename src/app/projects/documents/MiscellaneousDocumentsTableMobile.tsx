
'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { MiscellaneousDocument } from './types';

interface MiscellaneousDocumentsTableMobileProps {
  documents: MiscellaneousDocument[];
  selectedDocument: MiscellaneousDocument | null;
  onSelectDocument: (doc: MiscellaneousDocument) => void;
}

export function MiscellaneousDocumentsTableMobile({ documents, selectedDocument, onSelectDocument }: MiscellaneousDocumentsTableMobileProps) {
  return (
    <ScrollArea className="h-full">
      <div className="space-y-2 p-2">
        {documents.map((doc) => (
          <Card
            key={doc.id}
            onClick={() => onSelectDocument(doc)}
            className={cn('cursor-pointer', selectedDocument?.id === doc.id && 'border-primary')}
          >
            <CardContent className="p-3 text-xs space-y-1">
              <div className="flex justify-between font-bold">
                <p className="truncate pr-2">{doc.description}</p>
                <p className="text-muted-foreground whitespace-nowrap">{doc.date}</p>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                 <div><span className="font-medium text-muted-foreground">Αρ. Εγγράφου:</span> {doc.doc_no || "-"}</div>
                 <div><span className="font-medium text-muted-foreground">Από:</span> {doc.by}</div>
                 <div className="col-span-2 truncate"><span className="font-medium text-muted-foreground">Αρχείο:</span> {doc.path}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
