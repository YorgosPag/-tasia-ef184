

'use client';

import { useState } from 'react';
import type { ListItem as ListItemType } from '@/shared/lib/customListService';
import { useCustomListActions } from '@/shared/hooks/useCustomListActions';
import { ListItemDisplay } from './ListItemDisplay';
import { ListItemEdit } from './ListItemEdit';

interface ListItemProps {
  item: ListItemType;
  listId: string;
  hasCode?: boolean;
  canBeModified: boolean;
  fetchAllLists: () => Promise<void>;
}

export function ListItem({
  item,
  listId,
  hasCode,
  canBeModified,
  fetchAllLists,
}: ListItemProps) {
  const { updateItem, deleteItem } = useCustomListActions(fetchAllLists);
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
      const result = await updateItem(listId, item.id, dataToUpdate);
      if (result !== null) {
        setIsEditing(false);
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
    const confirmed = await deleteItem(listId, item.id, item.value);
    if (confirmed) {
      setIsEditing(false);
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
