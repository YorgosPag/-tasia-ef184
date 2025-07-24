
'use client';

import React, { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Trash2 } from 'lucide-react';
import { ListItemComponent } from './ListItem';
import { CustomList, ListItem } from '../hooks/useCustomLists';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface EditableListProps {
  list: CustomList;
  updateList: (id: string, title: string, description: string) => Promise<void>;
  deleteList: (id: string) => Promise<void>;
  addItem: (listId: string, rawValue: string) => Promise<void>;
  updateItem: (listId: string, itemId: string, data: Partial<ListItem>) => Promise<void>;
  deleteItem: (listId: string, itemId: string, itemValue: string) => Promise<void>;
}

export const EditableList = ({
  list,
  updateList,
  deleteList,
  addItem,
  updateItem,
  deleteItem,
}: EditableListProps) => {
  const [newItemValue, setNewItemValue] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddItem = async () => {
    if (!newItemValue.trim()) return;
    setIsAdding(true);
    await addItem(list.id, newItemValue);
    setNewItemValue('');
    setIsAdding(false);
  };

  return (
    <AccordionItem value={list.id} className="border rounded-md px-4 bg-background">
      <div className="flex items-center justify-between">
        <AccordionTrigger className="flex-1 py-4 text-left">
          <div>
            <h3 className="font-semibold">{list.title}</h3>
            <p className="text-sm text-muted-foreground">{list.description}</p>
          </div>
        </AccordionTrigger>
        <div className="flex items-center gap-1 pl-4">
          <Button variant="ghost" size="icon" disabled><Edit className="h-4 w-4" /></Button>
           <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" disabled={list.isProtected}><Trash2 className="h-4 w-4"/></Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                  <AlertDialogHeader>
                      <AlertDialogTitle>Είστε σίγουροι;</AlertDialogTitle>
                      <AlertDialogDescription>Αυτή η ενέργεια δεν μπορεί να αναιρεθεί. Θα διαγραφεί οριστικά η λίστα "{list.title}" και όλα τα στοιχεία της.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                      <AlertDialogCancel>Ακύρωση</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteList(list.id)} className="bg-destructive hover:bg-destructive/90">Διαγραφή</AlertDialogAction>
                  </AlertDialogFooter>
              </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <AccordionContent>
        <div className="max-h-[300px] overflow-y-auto pr-2 mb-4">
          <div className="space-y-1">
            {list.items.map((item) => (
              <ListItemComponent
                key={item.id}
                item={item}
                hasCode={list.hasCode}
                onUpdate={(data) => updateItem(list.id, item.id, data)}
                onDelete={() => deleteItem(list.id, item.id, item.value)}
              />
            ))}
          </div>
        </div>
        <div className="space-y-2 border-t pt-4">
          <Textarea
            placeholder={list.hasCode ? 'Προσθήκη στοιχείων (ΚΩΔΙΚΟΣ ΟΝΟΜΑ ανά γραμμή)' : 'Προσθήκη στοιχείων (διαχωρισμός με ; ή Enter)'}
            value={newItemValue}
            onChange={(e) => setNewItemValue(e.target.value)}
            rows={3}
          />
          <Button onClick={handleAddItem} disabled={isAdding} size="sm">
            {isAdding ? 'Προσθήκη...' : 'Προσθήκη Στοιχείου/ων'}
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
