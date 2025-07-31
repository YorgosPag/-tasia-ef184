
'use client';

import { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem } from '@/components/ui/accordion';
import type { CustomList, CreateListData } from '@/lib/types/definitions';
import { useAuth } from '@/hooks/use-auth';
import { EditableListHeader } from './EditableListHeader';
import { EditableListForm } from './EditableListForm';
import { EditableListItems } from './EditableListItems';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { logActivity } from '@/lib/logger';
import { writeBatch, doc, getDocs, collection, query, where, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface EditableListProps {
  list: CustomList;
  isOpen: boolean;
  onToggle: (id: string) => void;
  fetchAllLists: () => Promise<void>;
}

export function EditableList({ list, isOpen, onToggle, fetchAllLists }: EditableListProps) {
  const { isAdmin } = useAuth();
  const { toast } = useToast();

  const handleUpdate = async (field: 'title' | 'description', value: string) => {
    let dataToUpdate: Partial<CreateListData> = {};
    if (field === 'title' && value.trim() && value !== list.title) {
      dataToUpdate = { title: value };
    } else if (field === 'description' && value !== (list.description || '')) {
      dataToUpdate = { description: value };
    } else {
        return; // No change needed
    }

    if (Object.keys(dataToUpdate).length > 0) {
      try {
        await updateDoc(doc(db, 'tsia-custom-lists', list.id), dataToUpdate);
        toast({ title: 'Επιτυχία', description: 'Η λίστα ενημερώθηκε.'});
        fetchAllLists();
      } catch (error: any) {
        toast({ variant: 'destructive', title: 'Σφάλμα', description: `Η ενημέρωση απέτυχε: ${error.message}`});
      }
    }
  };

  const handleDelete = async () => {
     if (!isAdmin) {
        toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Δεν έχετε δικαιώματα για διαγραφή.' });
        return null;
      }

    if (!confirm(`Είστε σίγουροι ότι θέλετε να διαγράψετε τη λίστα "${list.title}" και όλα τα περιεχόμενά της; Αυτή η ενέργεια δεν μπορεί να αναιρεθεί.`)) {
      return null;
    }
      
      try {
        const batch = writeBatch(db);
        const listRef = doc(db, 'tsia-custom-lists', list.id);
        const itemsQuery = query(collection(listRef, 'tsia-items'));
        const itemsSnapshot = await getDocs(itemsQuery);
        itemsSnapshot.docs.forEach(itemDoc => batch.delete(itemDoc.ref));
        batch.delete(listRef);
        await batch.commit();

        await logActivity('DELETE_LIST', { entityId: list.id, entityType: 'custom-list', name: list.title });
        toast({ title: 'Επιτυχία', description: 'Η λίστα και όλα τα στοιχεία της διαγράφηκαν.'});
        fetchAllLists();
      } catch (error: any) {
        toast({ variant: 'destructive', title: 'Σφάλμα', description: `Η διαγραφή απέτυχε: ${error.message}`});
      }
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
                        fetchAllLists={fetchAllLists}
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
