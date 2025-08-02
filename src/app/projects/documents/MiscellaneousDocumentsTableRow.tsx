
'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { MiscellaneousDocument } from './types';

interface MiscellaneousDocumentsTableRowProps {
  document: MiscellaneousDocument;
  columns: Array<{ key: string; label: string; }>;
  columnWidths: number[];
  isSelected: boolean;
  onSelect: () => void;
}

export function MiscellaneousDocumentsTableRow({ document, columns, columnWidths, isSelected, onSelect }: MiscellaneousDocumentsTableRowProps) {
  return (
    <div
      onClick={onSelect}
      className={cn(
        'flex w-full min-h-[44px] items-stretch text-sm cursor-pointer border-b border-border/30 transition-colors',
        isSelected 
          ? 'bg-primary/10 hover:bg-primary/15' 
          : 'hover:bg-muted/40 even:bg-muted/10'
      )}
    >
      {columns.map(({ key }, index) => {
        const value = document[key as keyof MiscellaneousDocument] || '';
        
        return (
          <div
            key={key}
            className="flex-shrink-0 border-r last:border-r-0 border-border/30 h-full flex items-center overflow-hidden"
            style={{ width: `${columnWidths[index]}px` }}
          >
            <div className="px-3 py-2 w-full overflow-hidden">
              <span className="text-sm whitespace-nowrap overflow-hidden text-ellipsis block font-medium">
                {value as React.ReactNode}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
