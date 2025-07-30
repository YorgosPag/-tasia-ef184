'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { writeBatch, doc, collection, serverTimestamp, getDoc, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface EditableListFormProps {
  listId: string;
  hasCode?: boolean;
  fetchAllLists: () => void;
}

async function addItemsToCustomList(listId: string, rawValue: string, hasCode?: boolean): Promise<void> {
  const listRef = doc(db, 'tsia-custom-lists', listId);
  const listDoc = await getDoc(listRef);
  if (!listDoc.exists()) throw new Error("List not found.");

  const itemsCollectionRef = collection(listRef, 'tsia-items');
  const existingItemsSnapshot = await getDocs(itemsCollectionRef);
  const existingItems = existingItemsSnapshot.docs.map(d => d.data());

  let itemsToAdd: { value: string; code?: string }[] = [];

  if (hasCode) {
    const lines = rawValue.split(/[\r\n]+/).map(l => l.trim()).filter(Boolean);
    itemsToAdd = lines.map(line => {
      const firstSpaceIndex = line.indexOf(' ');
      if (firstSpaceIndex === -1) return { code: line, value: line };
      return { code: line.substring(0, firstSpaceIndex).trim(), value: line.substring(firstSpaceIndex + 1).trim() };
    }).filter(item => item.code && !existingItems.some(ex => ex.code?.toLowerCase() === item.code?.toLowerCase()));
  } else {
    const values = rawValue.split(/[;\n\r\t]+/).map(v => v.trim()).filter(Boolean);
    itemsToAdd = values.filter(value => !existingItems.some(ex => ex.value.toLowerCase() === value.toLowerCase())).map(value => ({ value }));
  }

  if (itemsToAdd.length === 0) {
    throw new Error('Όλα τα στοιχεία που εισάγατε υπάρχουν ήδη.');
  }

  const batch = writeBatch(db);
  itemsToAdd.forEach(item => {
    const newItemRef = doc(itemsCollectionRef);
    batch.set(newItemRef, { ...item, createdAt: serverTimestamp() });
  });
  await batch.commit();
}

export function EditableListForm({
  listId,
  hasCode,
  fetchAllLists
}: EditableListFormProps) {
  const [itemValue, setItemValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleAddItem = async () => {
    if (!itemValue.trim()) return;
    setIsSubmitting(true);
    try {
        await addItemsToCustomList(listId, itemValue, hasCode);
        toast({ title: 'Επιτυχία', description: 'Τα στοιχεία προστέθηκαν.'});
        setItemValue('');
        fetchAllLists();
    } catch(error: any) {
        toast({ variant: 'destructive', title: 'Σφάλμα', description: `Η προσθήκη απέτυχε: ${error.message}`});
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-2">
      <h4 className="font-semibold text-sm">Προσθήκη Στοιχείων</h4>
      <div className="grid gap-2">
        <Textarea
          placeholder={hasCode ? 'Εισάγετε ΚΩΔΙΚΟΣ [κενό] ΟΝΟΜΑΣΙΑ, ένα ανά γραμμή.' : 'Εισάγετε πολλαπλά στοιχεία με Enter, ; ή Tab.'}
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
    </div>
  );
}