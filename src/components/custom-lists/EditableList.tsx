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
  fetchAllLists: () => void;
}

const listIdToContactFieldMap: { [key: string]: string } = {
  "Jz1pB5tZSC8d41w8uKlA": "job.role",
  "k8zyKz2mC0d7j4x3R5bH": "job.specialty",
  "iGOjn86fcktREwMeDFPz": "identity.issuingAuthority",
  "jIt8lRiNcgatSchI90yd": "identity.type",
  "pL5fV6w8X9y7zE1bN3cO": "doy",
};

async function checkListDependencies(contactField: string, itemValues: string[]): Promise<{value: string, contactName: string}[]> {
    if (!contactField || itemValues.length === 0) return [];
  
    const CHUNK_SIZE = 30;
    const dependencies: {value: string, contactName: string}[] = [];
  
    for (let i = 0; i < itemValues.length; i += CHUNK_SIZE) {
      const chunk = itemValues.slice(i, i + CHUNK_SIZE);
      if (chunk.length === 0) continue;
  
      const q = query(collection(db, 'contacts'), where(contactField, 'in', chunk));
      const snapshot = await getDocs(q);
  
      snapshot.forEach(doc => {
        dependencies.push({
          value: doc.data()[contactField],
          contactName: doc.data().name
        });
      });

      if(dependencies.length >= 2) {
          return dependencies;
      }
    }
    
    return dependencies;
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

      const contactField = listIdToContactFieldMap[list.id];
      if (contactField) {
        const dependencies = await checkListDependencies(contactField, list.items.map((item) => item.value));
        if (dependencies.length > 0) {
          const examples = dependencies.slice(0, 2).map((d) => `"${d.value}" στην επαφή "${d.contactName}"`).join(', ');
          const warningMessage = `Η λίστα "${list.title}" χρησιμοποιείται σε ενεργά σημεία. Ενδεικτικά: ${examples}${dependencies.length > 2 ? '...' : ''}.`;
          if (!confirm(`${warningMessage}\n\nΕίστε σίγουρος ότι θέλετε να συνεχίσετε;`)) {
            return null;
          }
        }
      } else {
        if (!confirm(`Είστε σίγουροι ότι θέλετε να διαγράψετε τη λίστα "${list.title}" και όλα τα περιεχόμενά της;`)) {
          return null;
        }
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