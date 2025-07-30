
'use client';

import React, { useState, useEffect } from 'react';
import { getStorage, ref, getBlob } from 'firebase/storage';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/shared/hooks/use-toast';

interface FloorPlanViewerProps {
  pdfUrl?: string;
}

export function FloorPlanViewer({ pdfUrl }: FloorPlanViewerProps) {
  const [localPdfUrl, setLocalPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    let objectUrl: string | null = null;

    const fetchPdfAsBlob = async () => {
      if (!pdfUrl) return;

      setIsLoading(true);
      setError(null);
      setLocalPdfUrl(null);

      try {
        const storage = getStorage();
        // Create a reference from the full gs:// or https:// URL
        const storageRef = ref(storage, pdfUrl);
        const blob = await getBlob(storageRef);
        
        // Create a local URL for the blob
        objectUrl = URL.createObjectURL(blob);
        setLocalPdfUrl(objectUrl);

      } catch (err: any) {
        console.error("Error fetching PDF as blob:", err);
        setError("Η φόρτωση της κάτοψης απέτυχε. Ελέγξτε τα δικαιώματα του Firebase Storage (CORS).");
        toast({
          variant: 'destructive',
          title: 'Σφάλμα Φόρτωσης PDF',
          description: 'A CORS policy error is likely preventing the file from loading. Please check your Firebase Storage CORS settings.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPdfAsBlob();

    // Cleanup function to revoke the object URL when the component unmounts
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
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
        <p className="text-sm text-muted-foreground mt-2 text-center">
          For developers: Ensure your Firebase Storage bucket has a `cors.json` configuration that allows GET requests from this domain.
        </p>
      </div>
    );
  }

  if (!pdfUrl) {
    return (
      <div className="flex flex-col items-center justify-center h-40 border-2 border-dashed rounded-lg">
        <p className="text-muted-foreground">Δεν έχει ανεβεί κάτοψη για αυτόν τον όροφο.</p>
        <p className="text-sm text-muted-foreground mt-2">Παρακαλώ ανεβάστε ένα αρχείο PDF.</p>
      </div>
    );
  }
  
  if (!localPdfUrl) {
      // This state can occur between useEffect run and successful load
      return (
        <div className="flex h-96 w-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    );
  }

  return (
    <div style={{ height: '75vh', border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: '0.5rem', overflow: 'hidden' }}>
      <object
          data={localPdfUrl}
          type="application/pdf"
          width="100%"
          height="100%"
      >
        <p>
          Ο browser σας δεν υποστηρίζει την ενσωματωμένη προβολή PDF. Μπορείτε να το κατεβάσετε από
          <a href={pdfUrl} className="text-primary hover:underline" download> εδώ</a>.
        </p>
      </object>
    </div>
  );
}
