
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Loader2, Upload } from 'lucide-react';

interface FloorPlanUploadCardProps {
  onFileUpload: (file: File) => void;
  isUploading: boolean;
}

export function FloorPlanUploadCard({ onFileUpload, isUploading }: FloorPlanUploadCardProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    if (selectedFile) {
      onFileUpload(selectedFile);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ανέβασμα Κάτοψης</CardTitle>
        <CardDescription>Επιλέξτε ένα αρχείο PDF για να ανεβάσετε ως κάτοψη για αυτόν τον όροφο.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <Input
            id="pdf-upload"
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="flex-1"
          />
          <Button onClick={handleUploadClick} disabled={!selectedFile || isUploading}>
            {isUploading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            {isUploading ? 'Ανέβασμα...' : 'Ανέβασμα'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
