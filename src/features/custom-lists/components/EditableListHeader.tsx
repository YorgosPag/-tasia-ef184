'use client';

import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Edit, Trash2, ChevronDown } from 'lucide-react';
import type { CustomList } from '@/shared/lib/customListService';
import { cn } from '@/shared/lib/utils';

interface EditableListHeaderProps {
  list: CustomList;
  isOpen: boolean;
  canBeModified: boolean;
  onToggle: () => void;
  onUpdate: (field: 'title' | 'description', value: string) => void;
  onDelete: () => void;
}

export function EditableListHeader({ list, isOpen, canBeModified, onToggle, onUpdate, onDelete }: EditableListHeaderProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState(list.title);

  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [newDescription, setNewDescription] = useState(list.description || '');

  const handleBlur = (field: 'title' | 'description') => {
    if (field === 'title') {
      setIsEditingTitle(false);
      onUpdate('title', newTitle);
    } else {
      setIsEditingDescription(false);
      onUpdate('description', newDescription);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, field: 'title' | 'description') => {
    if (e.key === 'Enter' || e.key === 'Escape') {
      e.currentTarget.blur();
    }
  };

  const handleEditClick = (e: React.MouseEvent, field: 'title' | 'description') => {
    e.stopPropagation();
    if (field === 'title') {
      setIsEditingTitle(true);
    } else {
      setIsEditingDescription(true);
    }
  };

  return (
    <div className="flex items-center w-full px-4 rounded-md">
      <div className="flex-1 text-left py-4 cursor-pointer" onClick={onToggle}>
        {isEditingTitle ? (
          <Input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onBlur={() => handleBlur('title')}
            onKeyDown={(e) => handleKeyDown(e, 'title')}
            autoFocus
            className="h-8 font-bold text-base"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <div className="flex items-center gap-2">
            <p className="font-bold text-base">{list.title}</p>
            {canBeModified && (
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => handleEditClick(e, 'title')}>
                <Edit className="h-3 w-3" />
              </Button>
            )}
          </div>
        )}

        {isEditingDescription ? (
          <Input
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            onBlur={() => handleBlur('description')}
            onKeyDown={(e) => handleKeyDown(e, 'description')}
            autoFocus
            className="h-8 text-sm text-muted-foreground mt-1"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">
              {list.description || 'Δεν υπάρχει περιγραφή'}
            </p>
            {canBeModified && (
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => handleEditClick(e, 'description')}>
                <Edit className="h-3 w-3" />
              </Button>
            )}
          </div>
        )}
        <p className="text-xs text-muted-foreground font-mono mt-1">ID: {list.id}</p>
      </div>
      <div className="flex items-center gap-2 ml-4">
        {canBeModified && (
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive"
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            title="Διαγραφή Λίστας"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
        <ChevronDown
          className={cn('h-4 w-4 shrink-0 transition-transform duration-200 cursor-pointer', isOpen && 'rotate-180')}
          onClick={onToggle}
        />
      </div>
    </div>
  );
}
