'use client';

import type { ListItem as ListItemType } from '@/lib/customListService';
import { ListItem } from './ListItem';

interface EditableListItemsProps {
  items: ListItemType[];
  listId: string;
  hasCode?: boolean;
  canBeModified: boolean;
  fetchAllLists: () => Promise<void>;
}

export function EditableListItems({ items, listId, hasCode, canBeModified, fetchAllLists }: EditableListItemsProps) {
  return (
    <div className="space-y-2">
      <h4 className="font-semibold text-sm">Υπάρχοντα Στοιχεία ({items.length})</h4>
      {items.length > 0 ? (
        items.map((item) => (
          <ListItem
            key={item.id}
            item={item}
            listId={listId}
            hasCode={hasCode}
            canBeModified={canBeModified}
            fetchAllLists={fetchAllLists}
          />
        ))
      ) : (
        <p className="text-sm text-muted-foreground text-center py-4">
          Δεν υπάρχουν στοιχεία σε αυτή τη λίστα.
        </p>
      )}
    </div>
  );
}
