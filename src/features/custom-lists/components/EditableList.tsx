
'use client';

import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/components/ui/accordion';
import { Button } from '@/shared/components/ui/button';
import { Textarea } from '@/shared/components/ui/textarea';
import { Plus, Loader2, Edit, Trash2 } from 'lucide-react';
import { type CustomList, useCustomLists } from '@/hooks/useCustomLists';
import { ListItem } from './ListItem';

interface EditableListProps {
  list: CustomList;
}

export function EditableList({ list }: EditableListProps) {
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

  return (
    <AccordionItem value={list.id}>
      <AccordionTrigger className="hover:bg-muted/50 px-4 rounded-md">
        <div className="flex-1 flex items-center gap-4">
             {isEditingTitle ? (
                <Input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    onBlur={handleTitleBlur}
                    onKeyDown={(e) => e.key === 'Enter' && handleTitleBlur()}
                    autoFocus
                    className="h-8"
                    onClick={(e) => e.stopPropagation()}
                />
            ) : (
                <div className="text-left">
                    <p className="font-bold text-base">{list.title}</p>
                    <p className="text-sm text-muted-foreground">{list.description}</p>
                </div>
            )}
        </div>
        <div className="flex items-center gap-2">
            {!list.isProtected && (
                 <Button variant="ghost" size="icon" onClick={(e) => {e.stopPropagation(); setIsEditingTitle(true)}}><Edit className="h-4 w-4" /></Button>
            )}
            {!list.isProtected && (
                 <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={(e) => { e.stopPropagation(); deleteList(list.id, list.title)}}><Trash2 className="h-4 w-4" /></Button>
            )}
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 pt-4 border-t">
        <div className="space-y-4">
            <h4 className="font-semibold text-sm">Προσθήκη Στοιχείων</h4>
             <div className="grid gap-2">
                <Textarea
                    placeholder={list.hasCode ? 'Εισάγετε ΚΩΔΙΚΟΣ [κενό] ΟΝΟΜΑΣΙΑ, ένα ανά γραμμή.' : 'Εισάγετε πολλαπλά στοιχεία με Enter, ; ή Tab.'}
                    value={itemValue}
                    onChange={(e) => setItemValue(e.target.value)}
                    className="min-h-[80px]"
                />
                <Button onClick={handleAddItem} disabled={isSubmitting} size="sm" className="w-fit">
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Plus className="mr-2 h-4 w-4"/>}
                    Προσθήκη στοιχείων
                </Button>
            </div>
            
            <div className="space-y-2">
                 <h4 className="font-semibold text-sm">Υπάρχοντα Στοιχεία ({list.items.length})</h4>
                {list.items.length > 0 ? (
                    list.items.map(item => (
                       <ListItem key={item.id} item={item} listId={list.id} listTitle={list.title} hasCode={list.hasCode} />
                    ))
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">Δεν υπάρχουν στοιχεία σε αυτή τη λίστα.</p>
                )}
            </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
