'use client';

import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Edit, Trash2 } from 'lucide-react';
import { useCustomLists, type ListItem as ListItemType } from '@/hooks/useCustomLists';

interface ListItemViewProps {
  item: ListItemType;
  listId: string;
  hasCode?: boolean;
}

export function ListItem({ item, listId, hasCode }: ListItemViewProps) {
  const { updateItem, deleteItem, lists } = useCustomLists();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(item.value);
  const [editCode, setEditCode] = useState(item.code || '');

  const handleSave = async () => {
    const valueChanged = editValue.trim() !== item.value;
    const codeChanged = hasCode && (editCode.trim() !== (item.code || ''));
    
    if (valueChanged || codeChanged) {
      const dataToUpdate: { value: string; code?: string } = { value: editValue.trim() };
      if (hasCode) {
        dataToUpdate.code = editCode.trim();
      }
      await updateItem(listId, item.id, dataToUpdate);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditValue(item.value);
      setEditCode(item.code || '');
      setIsEditing(false);
    }
  };
  
  const handleDelete = async () => {
    const list = lists.find(l => l.id === listId);
    if (list) {
      // Assuming a direct mapping or a more robust lookup if needed.
      // For now, we pass a placeholder or a derived key. A real implementation
      // might need a more stable way to link list UI to backend logic if based on a mutable title.
      // Here, we use the list's ID which is stable.
      await deleteItem(listId, list.id, item.id, item.value);
    }
  }

  return (
    <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 group min-h-[40px]">
      {isEditing ? (
        <div className="flex items-center gap-2 flex-1">
          {hasCode && (
            <Input
              value={editCode}
              onChange={(e) => setEditCode(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              autoFocus
              className="h-8 w-24"
            />
          )}
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="h-8 flex-1"
          />
        </div>
      ) : (
        <div className="flex items-center gap-2 flex-1 min-w-0">
            {hasCode && <span className="font-mono text-xs bg-muted px-2 py-1 rounded-md">{item.code}</span>}
             <div className="flex flex-col flex-1 min-w-0">
                <span className="text-sm truncate">{item.value}</span>
                <span className="text-xs text-muted-foreground font-mono truncate">ID: {item.id}</span>
             </div>
        </div>
      )}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="icon" onClick={() => setIsEditing(!isEditing)}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={handleDelete}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
