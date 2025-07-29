
'use client';

import React from 'react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { ArrowLeft, Upload, Loader2, Paperclip } from 'lucide-react';

interface Floor {
  level: string;
  description?: string;
}

interface FloorInfoHeaderProps {
  floor: Floor;
  onBack: () => void;
  onFileUpload: (file: File) => void;
  isUploading: boolean;
}

/**
 * Displays the header for the floor details page, including navigation,
 * floor information, and the PDF upload functionality.
 */
export function FloorInfoHeader({
  floor,
  onBack,
  onFileUpload,
  isUploading,
}: FloorInfoHeaderProps) {
    
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
    // Reset file input to allow re-uploading the same file
    event.target.value = '';
  };
    
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" className="w-fit" type="button" onClick={onBack}>
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
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading}
        />
        <label htmlFor="pdf-upload">
            <Button asChild variant="outline" size="sm" disabled={isUploading}>
                <span>
                 {isUploading ? <Loader2 className="mr-2 animate-spin" /> : <Upload className="mr-2" />}
                 {isUploading ? 'Ανέβασμα...' : 'Ανέβασμα PDF'}
                </span>
            </Button>
        </label>
      </div>
    </div>
  );
}
