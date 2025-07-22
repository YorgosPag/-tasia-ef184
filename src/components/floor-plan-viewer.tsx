
'use client';

import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { Loader2, Minus, Plus, RefreshCw, Lock, Unlock } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface Unit {
  id: string;
  identifier: string;
  name: string;
  status: 'Διαθέσιμο' | 'Κρατημένο' | 'Πωλημένο' | 'Οικοπεδούχος';
  polygonPoints?: { x: number; y: number }[];
}

interface FloorPlanViewerProps {
  pdfUrl: string;
  units: Unit[];
  onUnitClick: (unitId: string) => void;
}

const getStatusColor = (status: Unit['status'] | undefined) => {
    switch(status) {
        case 'Πωλημένο': return '#ef4444'; // red-500
        case 'Κρατημένο': return '#f59e0b'; // yellow-500
        case 'Διαθέσιμο': return '#22c55e'; // green-500
        case 'Οικοπεδούχος': return '#f97316'; // orange-500
        default: return '#6b7280'; // gray-500
    }
}

export function FloorPlanViewer({ pdfUrl, units, onUnitClick }: FloorPlanViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [rotation, setRotation] = useState(0);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [pageDimensions, setPageDimensions] = useState({ width: 0, height: 0 });
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;
  }, []);
  
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
  
  function onPageLoadSuccess(page: any) {
    const { width, height } = page.getViewport({ scale: 1 });
    setPageDimensions({ width, height });
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
    <TooltipProvider>
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
                    onLoadSuccess={onPageLoadSuccess}
                    />
                    {pageDimensions.width > 0 && (
                    <svg
                        className="absolute top-0 left-0"
                        width={pageDimensions.width * scale}
                        height={pageDimensions.height * scale}
                        viewBox={`0 0 ${pageDimensions.width} ${pageDimensions.height}`}
                    >
                        {units.map((unit) =>
                        unit.polygonPoints ? (
                            <Tooltip key={unit.id} delayDuration={100}>
                                <TooltipTrigger asChild>
                                    <g onClick={() => handleUnitClick(unit.id)}>
                                        <polygon
                                            points={unit.polygonPoints.map(p => `${p.x},${p.y}`).join(' ')}
                                            className={
                                            `stroke-2 hover:opacity-100 cursor-pointer transition-opacity ` +
                                            (selectedUnitId === unit.id ? 'opacity-70' : 'opacity-40')
                                            }
                                            style={{
                                                fill: getStatusColor(unit.status),
                                                stroke: getStatusColor(unit.status)
                                            }}
                                        />
                                    </g>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="font-bold">{unit.name} ({unit.identifier})</p>
                                    <p>Κατάσταση: {unit.status}</p>
                                </TooltipContent>
                            </Tooltip>
                        ) : null
                        )}
                    </svg>
                    )}
                </div>
                </Document>
            )}
            </CardContent>
        </Card>
        <div className="flex items-center justify-center gap-2 p-2 rounded-md bg-muted">
            <Button variant="ghost" size="icon" onClick={() => setScale(s => Math.max(0.2, s - 0.1))} disabled={!numPages || isLocked}>
                <Minus />
            </Button>
            <span className="text-sm font-medium w-16 text-center">{(scale * 100).toFixed(0)}%</span>
            <Button variant="ghost" size="icon" onClick={() => setScale(s => Math.min(3, s + 0.1))} disabled={!numPages || isLocked}>
                <Plus />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setRotation(r => (r + 90) % 360)} disabled={!numPages || isLocked}>
                <RefreshCw />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsLocked(prev => !prev)} disabled={!numPages}>
                {isLocked ? <Lock /> : <Unlock />}
            </Button>
        </div>
        </div>
    </TooltipProvider>
  );
}
