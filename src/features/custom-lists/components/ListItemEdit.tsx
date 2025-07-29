
'use client';

import { Input } from '@/shared/components/ui/input';

interface ListItemEditProps {
  editValue: string;
  setEditValue: (value: string) => void;
  editCode: string;
  setEditCode: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  hasCode?: boolean;
}

export function ListItemEdit({
  editValue,
  setEditValue,
  editCode,
  setEditCode,
  onSave,
  onCancel,
  hasCode,
}: ListItemEditProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSave();
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <div className="flex items-center gap-2 flex-1">
      {hasCode && (
        <Input
          value={editCode}
          onChange={(e) => setEditCode(e.target.value)}
          onBlur={onSave}
          onKeyDown={handleKeyDown}
          autoFocus
          className="h-8 w-24"
        />
      )}
      <Input
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={onSave}
        onKeyDown={handleKeyDown}
        className="h-8 flex-1"
        autoFocus={!hasCode}
      />
    </div>
  );
}
