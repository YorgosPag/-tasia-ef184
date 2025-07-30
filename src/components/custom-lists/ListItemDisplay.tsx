
'use client';

import { Button } from '@/shared/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import type { ListItem as ListItemType } from '@/shared/lib/customListService';

interface ListItemDisplayProps {
  item: ListItemType;
  hasCode?: boolean;
  canBeModified: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export function ListItemDisplay({ item, hasCode, canBeModified, onEdit, onDelete }: ListItemDisplayProps) {
  return (
    <>
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {hasCode && (
          <span className="font-mono text-xs bg-muted px-2 py-1 rounded-md">
            {item.code}
          </span>
        )}
        <div className="flex flex-col flex-1 min-w-0">
          <span className="text-sm truncate">{item.value}</span>
          <span className="text-xs text-muted-foreground font-mono truncate">
            ID: {item.id}
          </span>
        </div>
      </div>
      {canBeModified && (
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onEdit}
            title="Επεξεργασία"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive"
            onClick={onDelete}
            title="Διαγραφή"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </>
  );
}
