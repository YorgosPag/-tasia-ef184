
'use client';

import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { Loader2, Minus, Plus, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

// Configure worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface Unit {
  id: string;
  identifier: string;
  name: string;
  svgPath?: string;
}

interface FloorPlanViewerProps {
  pdfUrl: string;
  units: Unit[];
  onUnitClick: (unitId: string) => void;
}

export function FloorPlanViewer({ pdfUrl, units, onUnitClick }: FloorPlanViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [rotation, setRotation] = useState(0);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);

  useEffect(() => {
    setPageNumber(1);
    setScale(1.0);
    setRotation(0);
  }, [pdfUrl]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPdfError(null);
  }

  function onDocumentLoadError(error: Error) {
    console.error('Error while loading document!', error);
    setPdfError(`Απέτυχε η φόρτωση του PDF: ${error.message}. Βεβαιωθείτε ότι το URL είναι σωστό και επιτρέπει την πρόσβαση (CORS).`);
  }

  const handleUnitClick = (unitId: string) => {
    setSelectedUnitId(unitId);
    onUnitClick(unitId);
  };
  
  const loadingElement = (
    <div className="flex flex-col items-center justify-center h-96 gap-4 text-muted-foreground">
      <Loader2 className="h-12 w-12 animate-spin" />
      <p>Φόρτωση κάτοψης...</p>
    </div>
  );

  return (
    <div className="flex flex-col gap-4 items-center">
      <Card className="w-full">
        <CardContent className="p-2 relative overflow-auto">
          {pdfError ? (
             <div className="flex items-center justify-center h-96 text-destructive text-center p-4">
               {pdfError}
             </div>
          ) : (
            <Document
              file={pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={loadingElement}
              className="flex justify-center"
            >
              <div className="relative">
                <Page 
                  pageNumber={pageNumber} 
                  scale={scale} 
                  rotate={rotation}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
                <svg
                  className="absolute top-0 left-0 w-full h-full"
                  style={{ transformOrigin: 'top left', transform: `scale(${scale})` }}
                  viewBox={`0 0 ${pdfjs.DEFAULT_VIEWPORT.width} ${pdfjs.DEFAULT_VIEWPORT.height}`} // Adjust based on actual PDF dimensions if needed
                >
                  {units.map((unit) =>
                    unit.svgPath ? (
                      <path
                        key={unit.id}
                        d={unit.svgPath}
                        className={
                          `fill-primary/20 stroke-primary hover:fill-primary/40 cursor-pointer transition-all ` +
                          (selectedUnitId === unit.id ? 'fill-primary/60 stroke-2' : 'stroke-1')
                        }
                        onClick={() => handleUnitClick(unit.id)}
                      />
                    ) : null
                  )}
                </svg>
              </div>
            </Document>
          )}
        </CardContent>
      </Card>
      <div className="flex items-center justify-center gap-2 p-2 rounded-md bg-muted">
        <Button variant="ghost" size="icon" onClick={() => setScale(s => Math.max(0.5, s - 0.2))} disabled={!numPages}>
          <Minus />
        </Button>
        <span className="text-sm font-medium w-16 text-center">{(scale * 100).toFixed(0)}%</span>
         <Button variant="ghost" size="icon" onClick={() => setScale(s => Math.min(3, s + 0.2))} disabled={!numPages}>
          <Plus />
        </Button>
         <Button variant="ghost" size="icon" onClick={() => setRotation(r => (r + 90) % 360)} disabled={!numPages}>
          <RefreshCw />
        </Button>
      </div>
    </div>
  );
}
