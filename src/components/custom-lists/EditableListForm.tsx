
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { addItemsToCustomList } from '@/lib/customListService';

interface EditableListFormProps {
  listId: string;
  hasCode?: boolean;
  fetchAllLists: () => void;
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
