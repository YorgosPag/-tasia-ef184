
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { ListItem } from '../hooks/useCustomLists';

interface ListItemProps {
  item: ListItem;
  hasCode: boolean;
  onUpdate: (data: Partial<ListItem>) => Promise<void>;
  onDelete: () => Promise<void>;
}

export const ListItemComponent = ({ item, hasCode, onUpdate, onDelete }: ListItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(item.value);
  const [code, setCode] = useState(item.code || '');
  const valueInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      valueInputRef.current?.focus();
    }
  }, [isEditing]);

  const handleSave = async () => {
    if (value.trim() === item.value && code.trim() === (item.code || '')) {
      setIsEditing(false);
      return;
    }
    await onUpdate({ value, code: hasCode ? code : undefined });
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') {
      setValue(item.value);
      setCode(item.code || '');
      setIsEditing(false);
    }
  };

  return (
    <div className="group flex items-center justify-between p-2 rounded-md hover:bg-muted">
      {isEditing ? (
        <div className="flex flex-1 items-center gap-2">
          {hasCode && (
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              className="h-8 w-24 font-mono"
            />
          )}
          <Input
            ref={valueInputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="h-8"
          />
        </div>
      ) : (
        <div className="flex-1 truncate">
          {hasCode && <span className="font-mono text-muted-foreground mr-2">{item.code}</span>}
          <span>{item.value}</span>
        </div>
      )}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsEditing(!isEditing)}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={onDelete}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
