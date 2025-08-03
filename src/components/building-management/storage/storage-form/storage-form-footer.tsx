'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, X } from 'lucide-react';

interface StorageFormFooterProps {
  onCancel: () => void;
}

export function StorageFormFooter({ onCancel }: StorageFormFooterProps) {
  return (
    <div className="p-6 border-t bg-muted/20 flex items-center justify-between">
      <div className="text-sm text-muted-foreground">
        * Υποχρεωτικά πεδία
      </div>
      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="w-4 h-4 mr-2" />
          Ακύρωση
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          <Save className="w-4 h-4 mr-2" />
          Αποθήκευση
        </Button>
      </div>
    </div>
  );
}
