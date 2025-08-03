'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Eye, 
  Edit
} from 'lucide-react';

interface StorageCardActionsProps {
  onEdit: () => void;
  unitId: string;
}

export function StorageCardActions({ onEdit, unitId }: StorageCardActionsProps) {
  return (
    <div className="pt-2 border-t border-border/10">
      <div className="flex justify-between items-center">
        <div className="flex gap-1">
          <Button 
            size="sm" 
            variant="ghost" 
            className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
          >
            <Eye className="w-3 h-3 mr-1" />
            Προβολή
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
          >
            <Edit className="w-3 h-3 mr-1" />
            Επεξεργασία
          </Button>
        </div>
        <div className="text-xs text-muted-foreground">
          #{unitId.slice(-3)}
        </div>
      </div>
    </div>
  );
}
