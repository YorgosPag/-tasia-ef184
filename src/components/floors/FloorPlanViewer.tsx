
'use client';

import React from 'react';

interface FloorPlanViewerProps {
  pdfUrl?: string;
}

export function FloorPlanViewer({ pdfUrl }: FloorPlanViewerProps) {
  if (!pdfUrl) {
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
          data={pdfUrl}
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
