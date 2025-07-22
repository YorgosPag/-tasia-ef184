
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { Loader2, Minus, Plus, RefreshCw, Lock, Unlock, Info, Pencil } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { cn } from '@/lib/utils';


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

const ALL_STATUSES: Unit['status'][] = ['Διαθέσιμο', 'Κρατημένο', 'Πωλημένο', 'Οικοπεδούχος'];

const getStatusColor = (status: Unit['status']) => {
    switch(status) {
        case 'Πωλημένο': return '#ef4444'; // red-500
        case 'Κρατημένο': return '#f59e0b'; // yellow-500
        case 'Διαθέσιμο': return '#22c55e'; // green-500
        case 'Οικοπεδούχος': return '#f97316'; // orange-500
        default: return '#6b7280'; // gray-500
    }
}

const getStatusClass = (status: Unit['status'] | undefined) => {
    switch(status) {
        case 'Πωλημένο': return 'bg-red-500 hover:bg-red-600 text-white';
        case 'Κρατημένο': return 'bg-yellow-500 hover:bg-yellow-600 text-white';
        case 'Διαθέσιμο': return 'bg-green-500 hover:bg-green-600 text-white';
        case 'Οικοπεδούχος': return 'bg-orange-500 hover:bg-orange-600 text-white';
        default: return 'bg-gray-500 hover:bg-gray-600 text-white';
    }
}


// Helper to get state from localStorage
const getInitialState = <T,>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') {
        return defaultValue;
    }
    const savedValue = localStorage.getItem(key);
    if (savedValue !== null) {
        try {
            return JSON.parse(savedValue);
        } catch (e) {
            console.error(`Error parsing localStorage key "${key}":`, e);
            return defaultValue;
        }
    }
    return defaultValue;
};


export function FloorPlanViewer({ pdfUrl, units, onUnitClick }: FloorPlanViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [pageDimensions, setPageDimensions] = useState({ width: 0, height: 0 });
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentPolygonPoints, setCurrentPolygonPoints] = useState<{ x: number; y: number }[]>([]);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);


  // Initialize state from localStorage or use defaults
  const [scale, setScale] = useState(() => getInitialState('floorPlanScale', 1.0));
  const [rotation, setRotation] = useState(() => getInitialState('floorPlanRotation', 0));
  const [isLocked, setIsLocked] = useState(() => getInitialState('floorPlanLocked', false));
  const [statusVisibility, setStatusVisibility] = useState(() => getInitialState('floorPlanStatusVisibility', {
      'Διαθέσιμο': true,
      'Κρατημένο': true,
      'Πωλημένο': true,
      'Οικοπεδούχος': true,
  }));


  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('floorPlanScale', JSON.stringify(scale));
  }, [scale]);

  useEffect(() => {
    localStorage.setItem('floorPlanRotation', JSON.stringify(rotation));
  }, [rotation]);

  useEffect(() => {
    localStorage.setItem('floorPlanLocked', JSON.stringify(isLocked));
  }, [isLocked]);

  useEffect(() => {
    localStorage.setItem('floorPlanStatusVisibility', JSON.stringify(statusVisibility));
  }, [statusVisibility]);


  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
  }, []);
  
  useEffect(() => {
    setPageNumber(1);
    setCurrentPolygonPoints([]); // Reset drawing on new PDF
  }, [pdfUrl]);

  useEffect(() => {
    // When exiting edit mode, clear the points
    if (!isEditMode) {
        setCurrentPolygonPoints([]);
        setMousePosition(null);
    }
  }, [isEditMode])

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPdfError(null);
  }

  function onDocumentLoadError(error: Error) {
    console.error('Error while loading document!', error);
    setPdfError(`Απέτυχε η φόρτωση του PDF: ${error.message}.`);
  }
  
  function onPageLoadSuccess(page: any) {
    const { width, height } = page.getViewport({ scale: 1 });
    setPageDimensions({ width, height });
  }

  const handleUnitClick = (unitId: string) => {
    if (isEditMode) return;
    setSelectedUnitId(unitId);
    onUnitClick(unitId);
  };
  
  const getSvgPoint = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return null;
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = event.clientX;
    pt.y = event.clientY;
    return pt.matrixTransform(svg.getScreenCTM()?.inverse());
  };

  const handleSvgClick = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!isEditMode) return;
    const svgPoint = getSvgPoint(event);
    if (svgPoint) {
      setCurrentPolygonPoints(prev => [...prev, { x: svgPoint.x, y: svgPoint.y }]);
    }
  };
  
  const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!isEditMode || currentPolygonPoints.length === 0) return;
    const svgPoint = getSvgPoint(event);
     if (svgPoint) {
      setMousePosition({ x: svgPoint.x, y: svgPoint.y });
    }
  };

  const handleMouseLeave = () => {
    setMousePosition(null);
  };


  const handleStatusVisibilityChange = (status: Unit['status'], checked: boolean) => {
      setStatusVisibility(prev => ({ ...prev, [status]: checked }));
  }

  const visibleUnits = units.filter(unit => statusVisibility[unit.status]);
  
  const loadingElement = (
    <div className="flex flex-col items-center justify-center h-96 gap-4 text-muted-foreground">
      <Loader2 className="h-12 w-12 animate-spin" />
      <p>Φόρτωση κάτοψης...</p>
    </div>
  );

  const drawingPolylinePoints = [...currentPolygonPoints];
  if (mousePosition) {
    drawingPolylinePoints.push(mousePosition);
  }

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
                    onLoadSuccess={onPageLoadSuccess}
                    />
                    {pageDimensions.width > 0 && (
                    <svg
                        ref={svgRef}
                        className="absolute top-0 left-0"
                        width={pageDimensions.width * scale}
                        height={pageDimensions.height * scale}
                        viewBox={`0 0 ${pageDimensions.width} ${pageDimensions.height}`}
                        style={{ pointerEvents: 'auto', cursor: isEditMode ? 'crosshair' : 'default' }}
                        onClick={handleSvgClick}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                    >
                        {/* Layer for existing polygons */}
                        <g>
                            {visibleUnits.map((unit) =>
                            unit.polygonPoints ? (
                                <Popover key={unit.id}>
                                    <PopoverTrigger asChild>
                                        <g onClick={() => handleUnitClick(unit.id)} style={{pointerEvents: isEditMode ? 'none' : 'auto'}}>
                                            <polygon
                                                points={unit.polygonPoints.map(p => `${p.x},${p.y}`).join(' ')}
                                                className={
                                                `stroke-2 hover:opacity-100 transition-opacity ` +
                                                (selectedUnitId === unit.id ? 'opacity-70' : 'opacity-40')
                                                }
                                                style={{
                                                    fill: getStatusColor(unit.status),
                                                    stroke: getStatusColor(unit.status)
                                                }}
                                            />
                                        </g>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-80">
                                    <div className="grid gap-4">
                                            <div className="space-y-2">
                                                <h4 className="font-medium leading-none">{unit.name} ({unit.identifier})</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    Περισσότερες λεπτομέρειες για το ακίνητο.
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium">Κατάσταση:</span>
                                                <Badge variant="default" className={getStatusClass(unit.status)}>
                                                    {unit.status}
                                                </Badge>
                                            </div>
                                            <Button size="sm" variant="outline" onClick={() => onUnitClick(unit.id)}>
                                                <Info className="mr-2 h-4 w-4" />
                                                Προβολή Στοιχείων
                                            </Button>
                                    </div>
                                    </PopoverContent>
                                </Popover>
                            ) : null
                            )}
                        </g>

                        {/* Layer for drawing new polygon */}
                        {isEditMode && drawingPolylinePoints.length > 0 && (
                            <g>
                                <polyline
                                    points={drawingPolylinePoints.map(p => `${p.x},${p.y}`).join(' ')}
                                    fill="none"
                                    stroke="hsl(var(--primary))"
                                    strokeWidth="2"
                                    strokeDasharray="4 4"
                                />
                                {currentPolygonPoints.map((point, index) => (
                                    <circle
                                        key={index}
                                        cx={point.x}
                                        cy={point.y}
                                        r="4"
                                        fill="hsl(var(--primary))"
                                        stroke="#fff"
                                        strokeWidth="1.5"
                                    />
                                ))}
                            </g>
                        )}
                    </svg>
                    )}
                </div>
                </Document>
            )}
            </CardContent>
        </Card>
        <div className="flex items-center justify-center gap-2 p-2 rounded-md bg-muted">
            <Button variant="ghost" size="icon" onClick={() => setScale(s => Math.max(0.2, s - 0.05))} disabled={!numPages || isLocked}>
                <Minus />
            </Button>
            <span className="text-sm font-medium w-16 text-center">{(scale * 100).toFixed(0)}%</span>
            <Button variant="ghost" size="icon" onClick={() => setScale(s => Math.min(3, s + 0.05))} disabled={!numPages || isLocked}>
                <Plus />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setRotation(r => (r + 90) % 360)} disabled={!numPages || isLocked}>
                <RefreshCw />
            </Button>
             <Button variant="ghost" size="icon" onClick={() => setIsLocked(prev => !prev)} disabled={!numPages}>
                {isLocked ? <Lock className="text-primary" /> : <Unlock />}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsEditMode(prev => !prev)} disabled={!numPages}>
                <Pencil className={cn(isEditMode && "text-primary")} />
            </Button>
        </div>

        <Card className="w-full max-w-md">
            <CardContent className="p-4">
                <h4 className="mb-4 text-sm font-medium leading-none">Εμφάνιση Layers</h4>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                    {ALL_STATUSES.map(status => (
                        <div key={status} className="flex items-center space-x-2">
                            <Checkbox
                                id={`status-${status}`}
                                checked={statusVisibility[status]}
                                onCheckedChange={(checked) => handleStatusVisibilityChange(status, checked as boolean)}
                                className="data-[state=checked]:bg-transparent"
                                style={{ borderColor: getStatusColor(status), color: getStatusColor(status) }}
                            />
                            <Label htmlFor={`status-${status}`} className="text-sm font-medium">
                                {status}
                            </Label>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>

        </div>
  );

}
