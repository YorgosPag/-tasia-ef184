
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Upload, Loader2 } from 'lucide-react';

interface Floor {
  level: string;
  description?: string;
}

interface FloorInfoHeaderProps {
  floor: Floor;
  onBack: () => void;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFileUpload: () => void;
  selectedFile: File | null;
  isUploading: boolean;
}

/**
 * Displays the header for the floor details page, including navigation,
 * floor information, and the PDF upload functionality.
 */
export function FloorInfoHeader({
  floor,
  onBack,
  onFileChange,
  onFileUpload,
  selectedFile,
  isUploading,
}: FloorInfoHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" className="w-fit" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Επιστροφή
        </Button>
        <div>
          <h1 className="text-xl font-bold">Όροφος: {floor.level}</h1>
          <p className="text-sm text-muted-foreground">
            Περιγραφή: {floor.description || 'N/A'}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Input
          id="pdf-upload"
          type="file"
          accept="application/pdf"
          onChange={onFileChange}
          className="max-w-xs text-xs h-9"
        />
        <Button onClick={onFileUpload} disabled={!selectedFile || isUploading} size="sm">
          {isUploading ? <Loader2 className="mr-2 animate-spin" /> : <Upload className="mr-2" />}
          {isUploading ? 'Ανέβασμα...' : 'Ανέβασμα'}
        </Button>
      </div>
    </div>
  );
}
