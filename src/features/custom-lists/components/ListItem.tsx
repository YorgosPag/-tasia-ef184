/home/user/studio/src/features/custom-lists/components/ListItem.tsx


'use client';

import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Edit, Trash2 } from 'lucide-react';
import { useCustomLists, type ListItem } from '@/hooks/useCustomLists';

interface ListItemViewProps {
  item: ListItem;
  listId: string;
  listTitle: string;
  hasCode?: boolean;
}

export function ListItem({ item, listId, listTitle, hasCode }: ListItemViewProps) {
  const { updateItem, deleteItem } = useCustomLists();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(item.value);
  const [editCode, setEditCode] = useState(item.code || '');

  const handleSave = async () => {
    if ((editValue.trim() !== item.value) || (hasCode && editCode.trim() !== item.code)) {
      const dataToUpdate: { value: string; code?: string } = { value: editValue.trim() };
      if (hasCode) {
        dataToUpdate.code = editCode.trim();
      }
      await updateItem(listId, item.id, dataToUpdate);
    }
    setIsEditing(false);
  };

  const handleDelete = async () => {
    await deleteItem(listId, listTitle, item.id, item.value);
  }

  return (
    <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 group">
      {isEditing ? (
        <div className="flex items-center gap-2 flex-1">
          {hasCode && (
            <Input
              value={editCode}
              onChange={(e) => setEditCode(e.target.value)}
              onBlur={handleSave}
              autoFocus
              className="h-8 w-24"
            />
          )}
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            className="h-8 flex-1"
          />
        </div>
      ) : (
        <div className="flex items-center gap-2">
            {hasCode && <span className="font-mono text-xs bg-muted px-2 py-1 rounded-md">{item.code}</span>}
            <span className="text-sm">{item.value}</span>
        </div>
      )}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={handleDelete}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
