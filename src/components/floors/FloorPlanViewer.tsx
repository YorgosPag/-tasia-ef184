
'use client';

import React, { useState, useEffect } from 'react';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/shared/hooks/use-toast';

interface FloorPlanViewerProps {
  pdfUrl?: string;
}

/**
 * Extracts the storage path from a Firebase Storage URL (gs:// or https://).
 * @param url The full URL of the file.
 * @returns The path inside the storage bucket.
 */
function getPathFromUrl(url: string): string | null {
    if (url.startsWith('gs://')) {
        return url.substring(5);
    }
    try {
        const urlObject = new URL(url);
        if (urlObject.hostname.endsWith('firebasestorage.googleapis.com')) {
            const pathName = urlObject.pathname;
            // Path is in the format /v0/b/bucket-name/o/path%2Fto%2Ffile
            const startIndex = pathName.indexOf('/o/') + 3;
            if (startIndex > 2) {
                const endIndex = pathName.indexOf('?');
                const encodedPath = endIndex === -1 ? pathName.substring(startIndex) : pathName.substring(startIndex, endIndex);
                return decodeURIComponent(encodedPath);
            }
        }
    } catch (error) {
        console.error("Invalid URL or failed to parse Firebase Storage URL:", url, error);
    }
    return null;
}

export function FloorPlanViewer({ pdfUrl }: FloorPlanViewerProps) {
  const [displayUrl, setDisplayUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!pdfUrl) {
      setError(null);
      setDisplayUrl(null);
      setIsLoading(false);
      return;
    }

    const fetchDownloadUrl = async () => {
      setIsLoading(true);
      setError(null);

      const storagePath = getPathFromUrl(pdfUrl);
      if (!storagePath) {
          setError("Μη έγκυρο URL κάτοψης. Δεν ήταν δυνατή η εξαγωγή της διαδρομής.");
          setIsLoading(false);
          return;
      }

      try {
        const storage = getStorage();
        const fileRef = ref(storage, storagePath); // Correctly create the reference from the path
        const url = await getDownloadURL(fileRef); // Get the temporary, authed URL
        setDisplayUrl(url);
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

  if (!pdfUrl || !displayUrl) {
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
          data={displayUrl}
          type="application/pdf"
          width="100%"
          height="100%"
      >
        <p>
          Ο browser σας δεν υποστηρίζει την ενσωματωμένη προβολή PDF. Μπορείτε να το κατεβάσετε από
          <a href={displayUrl} className="text-primary hover:underline" download> εδώ</a>.
        </p>
      </object>
    </div>
  );
}
