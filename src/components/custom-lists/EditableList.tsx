

'use client';

import { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem } from '@/components/ui/accordion';
import { useCustomListActions } from '@/hooks/useCustomListActions';
import type { CustomList } from '@/lib/customListService';
import { useAuth } from '@/hooks/use-auth';
import { EditableListHeader } from './EditableListHeader';
import { EditableListForm } from './EditableListForm';
import { EditableListItems } from './EditableListItems';
import { Card } from '@/components/ui/card';

interface EditableListProps {
  list: CustomList;
  isOpen: boolean;
  onToggle: (id: string) => void;
  fetchAllLists: () => Promise<void>;
}

export function EditableList({ list, isOpen, onToggle, fetchAllLists }: EditableListProps) {
  const { isSubmitting, addItem, updateList, deleteList } = useCustomListActions(fetchAllLists);
  const { isAdmin } = useAuth();
  const [itemValue, setItemValue] = useState('');

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
        return; // No change needed
    }

    if (Object.keys(dataToUpdate).length > 0) {
      await updateList(list.id, dataToUpdate);
    }
  };

  const handleDelete = async () => {
    await deleteList(list);
  };
  
  const canBeModified = isAdmin || !list.isProtected;

  return (
    <Card key={list.id}>
        <EditableListHeader
            list={list}
            isOpen={isOpen}
            canBeModified={canBeModified}
            onToggle={() => onToggle(list.id)}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
        />
      
      <Accordion type="single" collapsible value={isOpen ? list.id : ''}>
        <AccordionItem value={list.id} className="border-none">
          <AccordionContent className="px-4 pt-0 border-t">
            <div className="space-y-4 pt-4">
                {canBeModified && (
                    <EditableListForm
                        listId={list.id}
                        hasCode={list.hasCode}
                        itemValue={itemValue}
                        setItemValue={setItemValue}
                        onAdd={handleAddItem}
                        isSubmitting={isSubmitting}
                    />
                )}
              <EditableListItems
                items={list.items}
                listId={list.id}
                hasCode={list.hasCode}
                canBeModified={canBeModified}
                fetchAllLists={fetchAllLists}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
