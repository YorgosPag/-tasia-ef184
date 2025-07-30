
'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Loader2 } from 'lucide-react';

interface EditableListFormProps {
  listId: string;
  hasCode?: boolean;
  itemValue: string;
  setItemValue: (value: string) => void;
  onAdd: () => void;
  isSubmitting: boolean;
}

export function EditableListForm({
  listId,
  hasCode,
  itemValue,
  setItemValue,
  onAdd,
  isSubmitting,
}: EditableListFormProps) {
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
        <Button onClick={onAdd} disabled={isSubmitting} size="sm" className="w-fit">
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
