
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { Loader2, Minus, Plus, RefreshCw, Lock, Unlock, Info, Pencil, Undo2, Redo2, Edit, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

// Set worker path to a specific, compatible version from a CDN
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;


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
  drawingPolygon: { x: number; y: number }[] | null;
  onUnitClick: (unitId: string) => void;
  onUnitDelete: (unitId: string) => void;
  onPolygonDrawn: (points: { x: number; y: number }[]) => void;
  onUnitPointsUpdate: (unitId: string, newPoints: { x: number; y: number }[]) => void;
}

const ALL_STATUSES: Unit['status'][] = ['Διαθέσιμο', 'Κρατημένο', 'Πωλημένο', 'Οικοπεδούχος'];
const CLOSING_DISTANCE_THRESHOLD = 10; // Distance in SVG units to close the polygon

const getStatusColor = (status?: Unit['status']) => {
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


export function FloorPlanViewer({ pdfUrl, units, drawingPolygon, onUnitClick, onUnitDelete, onPolygonDrawn, onUnitPointsUpdate }: FloorPlanViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [pageDimensions, setPageDimensions] = useState({ width: 0, height: 0 });
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentPolygonPoints, setCurrentPolygonPoints] = useState<{ x: number; y: number }[]>([]);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const { toast } = useToast();
  
  // State for dragging points
  const [draggingPoint, setDraggingPoint] = useState<{ unitId: string; pointIndex: number } | null>(null);
  const [localUnits, setLocalUnits] = useState<Unit[]>(units);
  
  // Undo/Redo state
  const [history, setHistory] = useState<({ x: number; y: number }[])[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Sync local units state when the prop changes
  useEffect(() => {
    setLocalUnits(units);
  }, [units]);

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
    setPageNumber(1);
    resetDrawingState(); // Reset drawing on new PDF
  }, [pdfUrl]);

  const resetDrawingState = useCallback(() => {
    setCurrentPolygonPoints([]);
    setMousePosition(null);
    setHistory([[]]); // Start with a single empty state
    setHistoryIndex(0);
  }, []);

  const toggleEditMode = () => {
    setIsEditMode(prev => {
        const newMode = !prev;
        if (newMode) {
             // Entering edit mode, reset everything
             resetDrawingState();
        }
        return newMode;
    });
  }

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
    if (isEditMode || isLocked) return;
    setSelectedUnitId(unitId);
    // Don't call onUnitClick here, it will be called from the popover buttons
  };
  
  const getSvgPoint = (event: React.MouseEvent<SVGSVGElement | SVGCircleElement>) => {
    if (!svgRef.current) return null;
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = event.clientX;
    pt.y = event.clientY;
    return pt.matrixTransform(svg.getScreenCTM()?.inverse());
  };

  const handleSvgClick = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!isEditMode || isLocked) return;
    
    const svgPoint = getSvgPoint(event);
    if (!svgPoint) return;
    
    let newPoints = [...currentPolygonPoints, { x: svgPoint.x, y: svgPoint.y }];

    // Check if user is closing the polygon
    if (currentPolygonPoints.length > 1) {
        const firstPoint = currentPolygonPoints[0];
        const dx = firstPoint.x - svgPoint.x;
        const dy = firstPoint.y - svgPoint.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if(distance < CLOSING_DISTANCE_THRESHOLD) {
            // Finalize by setting the last point to be the same as the first
            newPoints = currentPolygonPoints; // Don't add a new point, just close with existing
            onPolygonDrawn(newPoints); // Callback with the finalized points
            setCurrentPolygonPoints([]); // Clear temp points
            setMousePosition(null); // Stop drawing line to mouse
            setIsEditMode(false); // Exit edit mode
            toast({
                title: "Το σχήμα ολοκληρώθηκε",
                description: "Οι συντεταγμένες είναι έτοιμες για αποθήκευση."
            });
            return;
        }
    }
    
    const newHistory = history.slice(0, historyIndex + 1);
    setHistory([...newHistory, newPoints]);
    setHistoryIndex(newHistory.length);
    setCurrentPolygonPoints(newPoints);
  };
  
  const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
    if (isLocked) return;
    const svgPoint = getSvgPoint(event);
    if (!svgPoint) return;

    // Handle dragging a point
    if (draggingPoint) {
      setLocalUnits(prevUnits => 
        prevUnits.map(unit => {
          if (unit.id === draggingPoint.unitId) {
            const newPoints = [...(unit.polygonPoints || [])];
            newPoints[draggingPoint.pointIndex] = { x: svgPoint.x, y: svgPoint.y };
            return { ...unit, polygonPoints: newPoints };
          }
          return unit;
        })
      );
      setMousePosition({ x: svgPoint.x, y: svgPoint.y });
      return;
    }
    
    if (isEditMode) {
      setMousePosition({ x: svgPoint.x, y: svgPoint.y });
    }
  };

  const handleMouseUp = () => {
    if (draggingPoint) {
      const unit = localUnits.find(u => u.id === draggingPoint.unitId);
      if (unit && unit.polygonPoints) {
        onUnitPointsUpdate(unit.id, unit.polygonPoints);
      }
      setDraggingPoint(null);
    }
  };

  const handlePointMouseDown = (event: React.MouseEvent<SVGCircleElement>, unitId: string, pointIndex: number) => {
    if (isLocked || isEditMode) return;
    event.stopPropagation(); // Prevent SVG click from firing
    setDraggingPoint({ unitId, pointIndex });
  };


  const handleMouseLeave = () => {
    setMousePosition(null);
    // If dragging, we should stop to prevent weird behavior
    if (draggingPoint) {
        handleMouseUp();
    }
  };

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCurrentPolygonPoints(history[newIndex]);
    }
  }, [history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCurrentPolygonPoints(history[newIndex]);
    }
  }, [history, historyIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (!isEditMode) return;
        if (e.metaKey || e.ctrlKey) {
            if (e.key === 'z') {
                e.preventDefault();
                handleUndo();
            } else if (e.key === 'y' || (e.shiftKey && e.key === 'z')) {
                e.preventDefault();
                handleRedo();
            }
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEditMode, handleUndo, handleRedo]);


  const handleStatusVisibilityChange = (status: Unit['status'], checked: boolean) => {
      setStatusVisibility(prev => ({ ...prev, [status]: checked }));
  }

  const visibleUnits = localUnits.filter(unit => statusVisibility[unit.status]);
  
  const loadingElement = (
    <div className="flex flex-col items-center justify-center h-96 gap-4 text-muted-foreground">
      <Loader2 className="h-12 w-12 animate-spin" />
      <p>Φόρτωση κάτοψης...</p>
    </div>
  );

  const drawingPolylinePoints = [...currentPolygonPoints];
  if (mousePosition && currentPolygonPoints.length > 0) {
    drawingPolylinePoints.push(mousePosition);
  }

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

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
                        style={{ pointerEvents: 'auto', cursor: isLocked ? 'not-allowed' : isEditMode ? 'crosshair' : 'default' }}
                        onClick={handleSvgClick}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseLeave}
                    >
                         {/* Layer for crosshair guides */}
                        {isEditMode && mousePosition && (
                            <g className="pointer-events-none">
                                <line 
                                    x1="0" y1={mousePosition.y} 
                                    x2={pageDimensions.width} y2={mousePosition.y} 
                                    stroke="hsl(var(--destructive))" 
                                    strokeWidth="0.5" 
                                    strokeDasharray="4 4" 
                                />
                                <line 
                                    x1={mousePosition.x} y1="0" 
                                    x2={mousePosition.x} y2={pageDimensions.height} 
                                    stroke="hsl(var(--destructive))" 
                                    strokeWidth="0.5" 
                                    strokeDasharray="4 4"
                                />
                            </g>
                        )}
                        {/* Layer for existing polygons */}
                        <g>
                            {visibleUnits.map((unit) =>
                            unit.polygonPoints ? (
                                <Popover key={unit.id}>
                                    <PopoverTrigger asChild>
                                        <g 
                                            onClick={() => handleUnitClick(unit.id)} 
                                            className="group/polygon"
                                            style={{
                                                pointerEvents: isEditMode || isLocked ? 'none' : 'auto', 
                                                cursor: isLocked ? 'not-allowed' : 'pointer'
                                            }}
                                        >
                                            <polygon
                                                points={unit.polygonPoints.map(p => `${p.x},${p.y}`).join(' ')}
                                                className={
                                                `stroke-2 group-hover/polygon:opacity-100 transition-opacity ` +
                                                (selectedUnitId === unit.id ? 'opacity-70' : 'opacity-40')
                                                }
                                                style={{
                                                    fill: getStatusColor(unit.status),
                                                    stroke: getStatusColor(unit.status)
                                                }}
                                            />
                                        </g>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto">
                                    <div className="grid gap-4">
                                            <div className="space-y-2">
                                                <h4 className="font-medium leading-none">{unit.name} ({unit.identifier})</h4>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-medium">Κατάσταση:</span>
                                                    <Badge variant="default" className={getStatusClass(unit.status)}>
                                                        {unit.status}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button size="sm" variant="outline" onClick={() => onUnitClick(unit.id)}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Επεξεργασία
                                                </Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button size="sm" variant="destructive_outline">
                                                          <Trash2 className="mr-2 h-4 w-4" />
                                                          Διαγραφή
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                        <AlertDialogTitle>Είστε σίγουροι;</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Αυτή η ενέργεια δεν μπορεί να αναιρεθεί. Θα διαγραφεί οριστικά το ακίνητο
                                                            "{unit.name} ({unit.identifier})".
                                                        </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                        <AlertDialogCancel>Ακύρωση</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => onUnitDelete(unit.id)} className="bg-destructive hover:bg-destructive/90">
                                                            Διαγραφή
                                                        </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                    </div>
                                    </PopoverContent>
                                </Popover>
                            ) : null
                            )}
                        </g>
                        
                        {/* Layer for draggable points on existing polygons */}
                        <g>
                            {!isEditMode && !isLocked && visibleUnits.map(unit =>
                                unit.polygonPoints?.map((point, index) => (
                                    <circle
                                        key={`${unit.id}-point-${index}`}
                                        cx={point.x}
                                        cy={point.y}
                                        r="5"
                                        fill={getStatusColor(unit.status)}
                                        stroke="#fff"
                                        strokeWidth="1.5"
                                        onMouseDown={(e) => handlePointMouseDown(e, unit.id, index)}
                                        className="cursor-move transition-all hover:r-7 hover:stroke-2"
                                    />
                                ))
                            )}
                        </g>

                        {/* Layer for drawing in-progress polyline */}
                        {isEditMode && currentPolygonPoints.length > 0 && (
                            <g className="pointer-events-none">
                                <polyline
                                    points={drawingPolylinePoints.map(p => `${p.x},${p.y}`).join(' ')}
                                    fill="none"
                                    stroke="hsl(var(--destructive))"
                                    strokeWidth="2"
                                    strokeDasharray="6 6"
                                />
                                {currentPolygonPoints.map((point, index) => (
                                    <circle
                                        key={index}
                                        cx={point.x}
                                        cy={point.y}
                                        r="4"
                                        fill={index === 0 ? "hsl(var(--destructive))" : "hsl(var(--primary))"}
                                        stroke="#fff"
                                        strokeWidth="1.5"
                                    />
                                ))}
                            </g>
                        )}
                        
                        {/* Layer for a finalized but unsaved polygon */}
                        {drawingPolygon && (
                             <g className="pointer-events-none">
                                <polygon
                                    points={drawingPolygon.map(p => `${p.x},${p.y}`).join(' ')}
                                    fill="hsla(var(--primary), 0.3)"
                                    stroke="hsl(var(--primary))"
                                    strokeWidth="2"
                                />
                             </g>
                        )}
                    </svg>
                    )}
                </div>
                </Document>
            )}
            </CardContent>
        </Card>
        <div className="flex flex-wrap items-center justify-center gap-2 p-2 rounded-md bg-muted">
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
            <Button variant="ghost" size="icon" onClick={toggleEditMode} disabled={!numPages || isLocked}>
                <Pencil className={cn(isEditMode && "text-primary")} />
            </Button>
            {isEditMode && (
                <>
                    <Button variant="ghost" size="icon" onClick={handleUndo} disabled={!canUndo}>
                        <Undo2 />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={handleRedo} disabled={!canRedo}>
                        <Redo2 />
                    </Button>
                </>
            )}
        </div>
        
        {isLocked && (
             <Card className="w-full max-w-md bg-yellow-500/10 border-yellow-500/40">
                <CardContent className="p-3 text-center">
                    <p className="text-sm text-yellow-700 font-medium">
                        Η επεξεργασία είναι κλειδωμένη.
                    </p>
                    <p className="text-xs text-yellow-700/80">
                        Πατήστε το εικονίδιο <Unlock size={12} className="inline-block -mt-px" /> για να την ενεργοποιήσετε.
                    </p>
                </CardContent>
            </Card>
        )}
        
        {isEditMode && (
            <Card className="w-full max-w-md bg-primary/10 border-primary/40">
                <CardContent className="p-3 text-center">
                    <p className="text-sm text-primary font-medium">
                        Λειτουργία Σχεδίασης: Κάντε κλικ στην κάτοψη για να προσθέσετε σημεία.
                    </p>
                    <p className="text-xs text-primary/80">
                        Κάντε κλικ κοντά στο πρώτο σημείο (κόκκινο) για να κλείσετε το σχήμα. (Ctrl+Z για αναίρεση)
                    </p>
                </CardContent>
            </Card>
        )}
        
        {!isEditMode && !isLocked && (
            <Card className="w-full max-w-md bg-secondary/60 border-secondary/40">
                <CardContent className="p-3 text-center">
                    <p className="text-sm text-secondary-foreground font-medium">
                        Λειτουργία Επεξεργασίας: Σύρετε τα σημεία για να αλλάξετε το σχήμα.
                    </p>
                </CardContent>
            </Card>
        )}


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
