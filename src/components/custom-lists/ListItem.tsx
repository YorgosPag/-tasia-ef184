
'use client';

import { useState } from 'react';
import type { ListItem as ListItemType } from '@/lib/customListService';
import { useToast } from '@/hooks/use-toast';
import { updateCustomListItem, deleteCustomListItem, checkListItemDependencies } from '@/lib/customListService';
import { listIdToContactFieldMap } from '@/lib/customListService';
import { ListItemDisplay } from './ListItemDisplay';
import { ListItemEdit } from './ListItemEdit';


interface ListItemProps {
  item: ListItemType;
  listId: string;
  hasCode?: boolean;
  canBeModified: boolean;
  fetchAllLists: () => void;
}

export function ListItem({
  item,
  listId,
  hasCode,
  canBeModified,
  fetchAllLists,
}: ListItemProps) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(item.value);
  const [editCode, setEditCode] = useState(item.code || '');

  const handleSave = async () => {
    const trimmedValue = editValue.trim();
    const trimmedCode = editCode.trim();

    const valueChanged = trimmedValue !== item.value;
    const codeChanged = hasCode && trimmedCode !== (item.code || '');

    if (valueChanged || codeChanged) {
      const dataToUpdate: { value: string; code?: string } = { value: trimmedValue };
      if (hasCode) {
        dataToUpdate.code = trimmedCode;
      }
      try {
        await updateCustomListItem(listId, item.id, dataToUpdate);
        toast({ title: 'Επιτυχία', description: 'Το στοιχείο ενημερώθηκε.' });
        fetchAllLists();
        setIsEditing(false);
      } catch (error: any) {
        toast({ variant: 'destructive', title: 'Σφάλμα', description: `Η ενημέρωση απέτυχε: ${error.message}`});
      }
    } else {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditValue(item.value);
    setEditCode(item.code || '');
    setIsEditing(false);
  };

  const handleDelete = async () => {
    const contactField = listIdToContactFieldMap[listId];
    const dependency = await checkListItemDependencies(contactField, item.value);

    if (dependency) {
      toast({
        variant: 'destructive',
        title: 'Αδυναμία Διαγραφής',
        description: `Το στοιχείο "${item.value}" χρησιμοποιείται από την επαφή: ${dependency}.`,
        duration: 5000,
      });
      return false;
    }

    if (!confirm(`Είστε σίγουροι ότι θέλετε να διαγράψετε το στοιχείο "${item.value}"`)) {
      return false;
    }

    try {
        await deleteCustomListItem(listId, item.id);
        toast({ title: 'Επιτυχία', description: `Το στοιχείο "${item.value}" διαγράφηκε.`});
        fetchAllLists();
        setIsEditing(false);
    } catch (error: any) {
        toast({ variant: 'destructive', title: 'Σφάλμα', description: `Η διαγραφή απέτυχε: ${error.message}`});
    }
  };

  return (
    <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 group min-h-[40px]">
      {isEditing ? (
        <ListItemEdit
          editValue={editValue}
          setEditValue={setEditValue}
          editCode={editCode}
          setEditCode={setEditCode}
          onSave={handleSave}
          onCancel={handleCancel}
          hasCode={hasCode}
        />
      ) : (
        <ListItemDisplay
          item={item}
          hasCode={hasCode}
          canBeModified={canBeModified}
          onEdit={() => setIsEditing(true)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
