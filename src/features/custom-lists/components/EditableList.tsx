
'use client';

import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from '@/shared/components/ui/accordion';
import { Button } from '@/shared/components/ui/button';
import { Textarea } from '@/shared/components/ui/textarea';
import { Input } from '@/shared/components/ui/input';
import { Plus, Loader2, Edit, Trash2, ChevronDown } from 'lucide-react';
import { useCustomListActions } from '@/hooks/useCustomListActions';
import type { CustomList } from '@/lib/customListService';
import { ListItem } from './ListItem';
import { Card } from '@/shared/components/ui/card';
import { cn } from '@/shared/lib/utils';
import { useAuth } from '@/shared/hooks/use-auth';

interface EditableListProps {
  list: CustomList;
  isOpen: boolean;
  onToggle: (id: string) => void;
}

export function EditableList({ list, isOpen, onToggle }: EditableListProps) {
  // Note: This component doesn't need to call useCustomLists directly.
  // It should receive the refetch function as a prop if needed, or rely
  // on the parent component's state management. For this case,
  // useCustomListActions is sufficient as it triggers the refetch.
  const { addItem, updateList, deleteList, isSubmitting } = useCustomListActions();
  const [itemValue, setItemValue] = useState('');
  const { isAdmin } = useAuth();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState(list.title);

  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [newDescription, setNewDescription] = useState(list.description || '');

  const handleAddItem = async () => {
    if (!itemValue.trim()) return;
    const result = await addItem(list.id, itemValue, list.hasCode);
    if (result) {
      setItemValue('');
    }
  };

  const handleUpdate = async (field: 'title' | 'description', value: string) => {
    let dataToUpdate: Partial<CustomList> = {};
    if (field === 'title' && value.trim() && value !== list.title) {
      dataToUpdate = { title: value };
    } else if (field === 'description' && value !== (list.description || '')) {
      dataToUpdate = { description: value };
    } else {
      if (field === 'title') setNewTitle(list.title);
      if (field === 'description') setNewDescription(list.description || '');
      return;
    }

    if (Object.keys(dataToUpdate).length > 0) {
      await updateList(list.id, dataToUpdate);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteList(list);
  };

  const handleEditClick = (e: React.MouseEvent, field: 'title' | 'description') => {
    e.stopPropagation();
    if (field === 'title') setIsEditingTitle(true);
    if (field === 'description') setIsEditingDescription(true);
  };
  
  const canBeModified = isAdmin || !list.isProtected;

  return (
    <Card key={list.id}>
      <div className="flex items-center w-full px-4 rounded-md">
        <div
          className="flex-1 text-left py-4 cursor-pointer"
          onClick={() => onToggle(list.id)}
        >
          {isEditingTitle ? (
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onBlur={() => {
                setIsEditingTitle(false);
                handleUpdate('title', newTitle);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === 'Escape') e.currentTarget.blur();
              }}
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
              onBlur={() => {
                setIsEditingDescription(false);
                handleUpdate('description', newDescription);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === 'Escape') e.currentTarget.blur();
              }}
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
                onClick={handleDelete}
                title="Διαγραφή Λίστας"
            >
                <Trash2 className="h-4 w-4" />
            </Button>
          )}
          <ChevronDown
            className={cn(
              'h-4 w-4 shrink-0 transition-transform duration-200 cursor-pointer',
              isOpen && 'rotate-180'
            )}
            onClick={() => onToggle(list.id)}
          />
        </div>
      </div>

      <Accordion type="single" collapsible value={isOpen ? list.id : ''}>
        <AccordionItem value={list.id} className="border-none">
          <AccordionContent className="px-4 pt-0 border-t">
            <div className="space-y-4 pt-4">
              <h4 className="font-semibold text-sm">Προσθήκη Στοιχείων</h4>
              <div className="grid gap-2">
                <Textarea
                  placeholder={list.hasCode ? 'Εισάγετε ΚΩΔΙΚΟΣ [κενό] ΟΝΟΜΑΣΙΑ, ένα ανά γραμμή.' : 'Εισάγετε πολλαπλά στοιχεία με Enter, ; ή Tab.'}
                  value={itemValue}
                  onChange={(e) => setItemValue(e.target.value)}
                  className="min-h-[80px]"
                />
                <Button onClick={handleAddItem} disabled={isSubmitting} size="sm" className="w-fit">
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="mr-2 h-4 w-4" />
                  )}
                  Προσθήκη στοιχείων
                </Button>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Υπάρχοντα Στοιχεία ({list.items.length})</h4>
                {list.items.length > 0 ? (
                  list.items.map((item) => (
                    <ListItem key={item.id} item={item} listId={list.id} hasCode={list.hasCode} />
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Δεν υπάρχουν στοιχεία σε αυτή τη λίστα.
                  </p>
                )}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
