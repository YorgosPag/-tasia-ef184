'use client';

import { useState } from 'react';
import type { ListItem as ListItemType } from '@/lib/types/definitions';
import { useToast } from '@/hooks/use-toast';
import { doc, updateDoc, deleteDoc, query, collection, where, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ListItemDisplay } from './ListItemDisplay';
import { ListItemEdit } from './ListItemEdit';


interface ListItemProps {
  item: ListItemType;
  listId: string;
  hasCode?: boolean;
  canBeModified: boolean;
  fetchAllLists: () => void;
}

const listIdToContactFieldMap: { [key: string]: string } = {
  "Jz1pB5tZSC8d41w8uKlA": "job.role",
  "k8zyKz2mC0d7j4x3R5bH": "job.specialty",
  "iGOjn86fcktREwMeDFPz": "identity.issuingAuthority",
  "jIt8lRiNcgatSchI90yd": "identity.type",
  "pL5fV6w8X9y7zE1bN3cO": "doy",
};

async function checkListItemDependencies(contactField: string, itemValue: string): Promise<string | null> {
  if (!contactField) return null;
  const q = query(collection(db, 'contacts'), where(contactField, '==', itemValue), limit(1));
  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    return snapshot.docs[0].data().name as string;
  }
  return null;
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
        await updateDoc(doc(db, 'tsia-custom-lists', listId, 'tsia-items', item.id), dataToUpdate);
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
        await deleteDoc(doc(db, 'tsia-custom-lists', listId, 'tsia-items', item.id));
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