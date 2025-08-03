'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Eye, 
  Download,
  Upload,
  Camera,
  Image as ImageIcon
} from "lucide-react";

export function PhotosTab() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Φωτογραφίες Κτιρίου</h3>
        <div className="flex gap-2">
          <label className="cursor-pointer">
            <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e.target.files)} />
            <Button asChild><span><Upload className="w-4 h-4 mr-2" />Ανέβασμα Φωτογραφιών</span></Button>
          </label>
        </div>
      </div>
      <div 
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors bg-gray-50 hover:bg-blue-50"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); handleFileUpload(e.dataTransfer.files); }}
      >
        <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-lg font-medium text-gray-900 mb-2">Σύρετε φωτογραφίες εδώ</p>
        <p className="text-sm text-gray-500">ή κάντε κλικ για επιλογή αρχείων</p>
      </div>
      {isUploading && (
        <Card><CardContent className="p-4"><div className="flex items-center space-x-3"><div className="flex-shrink-0"><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div></div><div className="flex-1"><p className="text-sm font-medium text-gray-900">Ανέβασμα σε εξέλιξη...</p><Progress value={uploadProgress} className="mt-2" /><p className="text-xs text-gray-500 mt-1">{uploadProgress}% ολοκληρώθηκε</p></div></div></CardContent></Card>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div className="relative group">
          <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg overflow-hidden">
            <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3E%3Cpath fill='%236B7280' d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'/%3E%3C/svg%3E" alt="Building progress" className="w-full h-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all rounded-lg flex items-center justify-center"><div className="opacity-0 group-hover:opacity-100 flex gap-2"><Button size="sm" variant="secondary"><Eye className="w-4 h-4" /></Button><Button size="sm" variant="secondary"><Download className="w-4 h-4" /></Button></div></div>
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">Πρόοδος Φεβ 2025</div>
        </div>
        {[1, 2, 3, 4, 5].map((index) => (
          <div key={index} className="aspect-square bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border hover:border-blue-400 transition-colors cursor-pointer group"><div className="text-center"><ImageIcon className="w-8 h-8 text-muted-foreground group-hover:text-blue-500 mx-auto mb-2" /><p className="text-sm text-muted-foreground">Προσθήκη Φωτογραφίας</p></div></div>
        ))}
      </div>
    </div>
  );
}
