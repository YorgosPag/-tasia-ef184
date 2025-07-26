
'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, Loader2, Trash2, Pencil } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/shared/components/ui/button';
import { useToast } from '@/shared/hooks/use-toast';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '@/shared/lib/firebase';
import { Progress } from '@/shared/components/ui/progress';
import { Label } from '@/shared/components/ui/label';
import { useFormContext } from 'react-hook-form';

interface ImageUploaderProps {
  entityType: 'Φυσικό Πρόσωπο' | 'Νομικό Πρόσωπο' | 'Δημ. Υπηρεσία' | undefined;
  entityId?: string;
  initialImageUrl?: string | null;
  onFileSelect: (file: File | null) => void;
}

export function ImageUploader({
  entityType,
  entityId,
  initialImageUrl,
  onFileSelect,
}: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(initialImageUrl || null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();
  const form = useFormContext(); // Get form context

  useEffect(() => {
    setPreview(initialImageUrl || null);
  }, [initialImageUrl]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (!entityType) {
        toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Πρέπει πρώτα να επιλέξετε τύπο οντότητας.' });
        return;
      }
      if (acceptedFiles.length === 0) return;
      
      const file = acceptedFiles[0];
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast({ variant: 'destructive', title: 'Το αρχείο είναι πολύ μεγάλο', description: 'Παρακαλώ επιλέξτε αρχείο μικρότερο από 2MB.' });
        return;
      }
      
      const filePreviewUrl = URL.createObjectURL(file);
      setPreview(filePreviewUrl);
      onFileSelect(file);
      // Manually mark the form as dirty when a new file is selected
      form.setValue('photoUrl', filePreviewUrl, { shouldDirty: true });
    },
    [entityType, toast, onFileSelect, form]
  );
  
  const handleDelete = async () => {
    if (!preview) return;

    // For existing contacts with an image on storage
    if (entityId && initialImageUrl && initialImageUrl.startsWith('https://firebasestorage.googleapis.com')) {
        try {
            const storageRef = ref(storage, initialImageUrl);
            await deleteObject(storageRef);
        } catch (error: any) {
            if (error.code !== 'storage/object-not-found') {
                console.error("Error deleting image from storage:", error);
                toast({ variant: 'destructive', title: 'Σφάλμα Διαγραφής', description: 'Δεν ήταν δυνατή η διαγραφή της εικόνας από το storage.' });
                return;
            }
        }
    }
    
    setPreview(null);
    onFileSelect(null);
    form.setValue('photoUrl', '', { shouldDirty: true });
    toast({ title: 'Επιτυχία', description: 'Η εικόνα αφαιρέθηκε.' });
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [], 'image/webp': [] },
    multiple: false,
  });

  const getLabel = () => {
    if (!entityType) return 'Επιλέξτε Τύπο Οντότητας';
    return entityType === 'Φυσικό Πρόσωπο' ? 'Ανέβασε Φωτογραφία' : 'Ανέβασε Λογότυπο';
  };

  if (preview) {
    return (
      <div className="space-y-2">
        <Label>{getLabel()}</Label>
        <div className="relative group aspect-square w-32">
          <Image src={preview} alt="Preview" width={128} height={128} className="rounded-md object-cover" />
           <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
               <Button type="button" size="icon" variant="ghost" className="text-white hover:text-white" {...getRootProps()}>
                  <Pencil className="h-5 w-5" />
                  <input {...getInputProps()} className="sr-only"/>
                </Button>
                <Button type="button" size="icon" variant="ghost" className="text-white hover:text-white" onClick={handleDelete}>
                    <Trash2 className="h-5 w-5"/>
                </Button>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label>{getLabel()}</Label>
      <div
        {...getRootProps()}
        className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/80
        ${isDragActive ? 'border-primary' : 'border-input'}`}
      >
        <input {...getInputProps()} disabled={!entityType || isUploading} />
        {isUploading ? (
          <div className="flex flex-col items-center justify-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Ανέβασμα...</p>
            <Progress value={uploadProgress} className="w-2/3 h-1.5 mt-1" />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground" />
            <p className="mb-1 text-sm text-muted-foreground">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-muted-foreground">JPG, PNG or WEBP (MAX. 2MB)</p>
          </div>
        )}
      </div>
    </div>
  );
}
