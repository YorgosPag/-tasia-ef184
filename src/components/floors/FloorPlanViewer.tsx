
'use client';

import React, { useState, useEffect } from 'react';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/shared/hooks/use-toast';

interface FloorPlanViewerProps {
  pdfUrl?: string;
}

// Function to extract the path from a Firebase Storage URL
function getPathFromUrl(url: string): string | null {
    try {
        const urlObject = new URL(url);
        if (urlObject.hostname === 'firebasestorage.googleapis.com') {
            // Pathname is in the format /v0/b/your-bucket.appspot.com/o/path%2Fto%2Fyour%2Ffile.pdf
            // We need to decode it and extract the path after the '/o/'
            const path = decodeURIComponent(urlObject.pathname.split('/o/')[1].split('?')[0]);
            return path;
        }
    } catch (error) {
        console.error("Invalid URL for storage path extraction:", error);
    }
    return null;
}


export function FloorPlanViewer({ pdfUrl }: FloorPlanViewerProps) {
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!pdfUrl) {
      setError(null);
      setDownloadUrl(null);
      setIsLoading(false);
      return;
    }

    const fetchDownloadUrl = async () => {
      setIsLoading(true);
      setError(null);

      const storagePath = getPathFromUrl(pdfUrl);
      if (!storagePath) {
          setError("Μη έγκυρο URL κάτοψης.");
          setIsLoading(false);
          return;
      }

      try {
        const storage = getStorage();
        const storageRef = ref(storage, storagePath);
        const url = await getDownloadURL(storageRef);
        setDownloadUrl(url);
      } catch (err: any) {
        console.error("Error getting download URL:", err);
        setError("Η φόρτωση της κάτοψης απέτυχε.");
        toast({
          variant: 'destructive',
          title: 'Σφάλμα Φόρτωσης PDF',
          description: `Code: ${err.code}. Message: ${err.message}`,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDownloadUrl();
  }, [pdfUrl, toast]);


  if (isLoading) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="ml-2">Φόρτωση κάτοψης...</p>
      </div>
    );
  }

  if (error) {
     return (
      <div className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-destructive/50 rounded-lg p-4">
        <p className="text-destructive font-semibold">{error}</p>
      </div>
    );
  }

  if (!pdfUrl || !downloadUrl) {
    return (
      <div className="flex flex-col items-center justify-center h-40 border-2 border-dashed rounded-lg">
        <p className="text-muted-foreground">Δεν έχει ανεβεί κάτοψη για αυτόν τον όροφο.</p>
        <p className="text-sm text-muted-foreground mt-2">Παρακαλώ ανεβάστε ένα αρχείο PDF.</p>
      </div>
    );
  }
  
  return (
    <div style={{ height: '75vh', border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: '0.5rem', overflow: 'hidden' }}>
      <object
          data={downloadUrl}
          type="application/pdf"
          width="100%"
          height="100%"
      >
        <p>
          Ο browser σας δεν υποστηρίζει την ενσωματωμένη προβολή PDF. Μπορείτε να το κατεβάσετε από
          <a href={downloadUrl} className="text-primary hover:underline" download> εδώ</a>.
        </p>
      </object>
    </div>
  );
}
