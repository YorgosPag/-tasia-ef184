
'use client';

import React, { useState } from 'react';
import { doc, updateDoc, arrayUnion, arrayRemove, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '@/shared/lib/firebase';
import { useToast } from '@/shared/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Loader2, Upload, Trash2, CameraOff } from 'lucide-react';
import Image from 'next/image';
import { Unit } from '@/tasia/hooks/use-unit-details';
import { Dialog, DialogContent, DialogTrigger } from '@/shared/components/ui/dialog';

interface UnitPhotosTabProps {
  unit: Unit;
}

export function UnitPhotosTab({ unit }: UnitPhotosTabProps) {
  const { toast } = useToast();
  const [files, setFiles] = useState<FileList | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
  };

  const handleUpload = async () => {
    if (!files || files.length === 0) return;
    setIsUploading(true);

    const uploadPromises = Array.from(files).map(async (file) => {
      const storageRef = ref(storage, `unit_photos/${unit.id}/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      return { url, name: file.name, uploadedAt: Timestamp.now() };
    });

    try {
      const newPhotos = await Promise.all(uploadPromises);
      const unitRef = doc(db, 'units', unit.id);
      await updateDoc(unitRef, {
        photos: arrayUnion(...newPhotos)
      });
      toast({ title: 'Επιτυχία', description: `${files.length} φωτογραφίες ανέβηκαν.` });
      setFiles(null);
      // Reset file input
      const input = document.getElementById('photo-upload-input') as HTMLInputElement;
      if (input) input.value = '';
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Σφάλμα', description: `Η μεταφόρτωση απέτυχε: ${error.message}` });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (photo: { url: string; name: string }) => {
    try {
      // Delete from Storage
      const photoRef = ref(storage, photo.url);
      await deleteObject(photoRef);

      // Delete from Firestore document
      const unitRef = doc(db, 'units', unit.id);
      await updateDoc(unitRef, {
        photos: arrayRemove(photo)
      });
      
      toast({ title: 'Επιτυχία', description: 'Η φωτογραφία διαγράφηκε.' });
    } catch (error: any) {
       toast({ variant: 'destructive', title: 'Σφάλμα', description: `Η διαγραφή απέτυχε: ${error.message}` });
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Φωτογραφίες Ακινήτου</CardTitle>
        <CardDescription>Ανεβάστε και διαχειριστείτε τις φωτογραφίες που σχετίζονται με αυτό το ακίνητο.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4 p-4 border rounded-lg">
          <Input id="photo-upload-input" type="file" multiple accept="image/*" onChange={handleFileChange} />
          <Button onClick={handleUpload} disabled={isUploading || !files}>
            {isUploading ? <Loader2 className="mr-2 animate-spin" /> : <Upload className="mr-2" />}
            {isUploading ? 'Ανέβασμα...' : 'Ανέβασμα'}
          </Button>
        </div>
        
        {unit.photos && unit.photos.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {unit.photos.map((photo, index) => (
              <div key={index} className="relative group border rounded-lg overflow-hidden aspect-square">
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="relative w-full h-full cursor-pointer">
                      <Image
                          src={photo.url}
                          alt={photo.name || `Unit Photo ${index + 1}`}
                          fill
                          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                          className="object-contain"
                      />
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl h-auto p-2 bg-transparent border-none">
                      <img src={photo.url} alt={photo.name || `Unit Photo ${index + 1}`} className="max-w-full max-h-[90vh] mx-auto object-contain" />
                  </DialogContent>
                </Dialog>
                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleDelete(photo)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-40 border-2 border-dashed rounded-lg">
            <CameraOff className="h-10 w-10" />
            <p className="mt-2 text-sm">Δεν υπάρχουν φωτογραφίες για αυτό το ακίνητο.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
