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
import { type CustomList, useCustomLists } from '@/hooks/useCustomLists';
import { ListItem } from './ListItem';
import { Card } from '@/shared/components/ui/card';
import { cn } from '@/shared/lib/utils';

interface EditableListProps {
  list: CustomList;
  isOpen: boolean;
  onToggle: (id: string) => void;
}

export function EditableList({ list, isOpen, onToggle }: EditableListProps) {
  const { addItem, updateList, deleteList, isSubmitting } = useCustomLists();
  const [itemValue, setItemValue] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState(list.title);

  const handleAddItem = async () => {
    if (!itemValue.trim()) return;
    const success = await addItem(list.id, itemValue, list.hasCode);
    if (success) {
      setItemValue('');
    }
  };

  const handleTitleBlur = async () => {
    setIsEditingTitle(false);
    if (newTitle.trim() && newTitle !== list.title) {
      await updateList(list.id, { title: newTitle });
    } else {
      setNewTitle(list.title);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent toggling the accordion
    deleteList(list.id, list.title);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent toggling the accordion
    setIsEditingTitle(true);
  };

  return (
    <Card>
      <div className="flex items-center w-full px-4 rounded-md">
        <div
          className="flex-1 text-left py-4 cursor-pointer"
          onClick={() => onToggle(list.id)}
        >
          {isEditingTitle ? (
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onBlur={handleTitleBlur}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleTitleBlur();
                if (e.key === 'Escape') setIsEditingTitle(false);
              }}
              autoFocus
              className="h-8"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <div>
              <p className="font-bold text-base">{list.title}</p>
              {list.description && <p className="text-sm text-muted-foreground">{list.description}</p>}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 ml-4">
          {!list.isProtected && (
            <Button variant="ghost" size="icon" onClick={handleEditClick} title="Επεξεργασία Λίστας">
              <Edit className="h-4 w-4" />
            </Button>
          )}
          {!list.isProtected && (
            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={handleDelete} title="Διαγραφή Λίστας">
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
          <ChevronDown className={cn("h-4 w-4 shrink-0 transition-transform duration-200 cursor-pointer", isOpen && "rotate-180")} onClick={() => onToggle(list.id)} />
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
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                  Προσθήκη στοιχείων
                </Button>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Υπάρχοντα Στοιχεία ({list.items.length})</h4>
                {
                  list.items.length > 0 ? (
                    list.items.map(item => (
                      <ListItem key={item.id} item={item} listId={list.id} hasCode={list.hasCode} />
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">Δεν υπάρχουν στοιχεία σε αυτή τη λίστα.</p>
                  )
                }
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
