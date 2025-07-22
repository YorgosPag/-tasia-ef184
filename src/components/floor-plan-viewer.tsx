
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Document, Page, pdfjs, PDFPageProxy } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { Loader2, Minus, Plus, RefreshCw, Lock, Unlock, Info, Pencil, Undo2, Redo2, Edit, Trash2, ZoomIn, Frame } from 'lucide-react';
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
} from "@/components/ui/alert-dialog"
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Input } from './ui/input';

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
const CLOSING_DISTANCE_THRESHOLD = 15; // Distance in SVG units to close the polygon
const SNAPPING_DISTANCE_THRESHOLD = 10; // Distance to snap to an existing vertex
const PRECISION_ZOOM_SCALE = 2.5;


const getStatusColor = (status?: Unit['status']) => {
    switch(status) {
        case 'Πωλημένο': return 'hsl(var(--destructive))';
        case 'Κρατημένο': return 'hsl(var(--primary))';
        case 'Διαθέσιμο': return '#22c55e'; // green-500
        case 'Οικοπεδούχος': return '#f97316'; // orange-500
        default: return '#6b7280'; // gray-500
    }
}

const getStatusClass = (status: Unit['status'] | undefined) => {
    switch(status) {
        case 'Πωλημένο': return 'bg-destructive text-destructive-foreground';
        case 'Κρατημένο': return 'bg-primary text-primary-foreground';
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
  const [pageDimensions, setPageDimensions] = useState({ width: 0, height: 0, cropBox: { x: 0, y: 0, width: 0, height: 0 } });
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentPolygonPoints, setCurrentPolygonPoints] = useState<{ x: number; y: number }[]>([]);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);
  const [snapPoint, setSnapPoint] = useState<{ x: number; y: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // State for dragging points
  const [draggingPoint, setDraggingPoint] = useState<{ unitId: string; pointIndex: number } | null>(null);
  
  const [localUnits, setLocalUnits] = useState<Unit[]>(units);
  useEffect(() => {
    setLocalUnits(units);
  }, [units]);

  
  // Undo/Redo state
  const [history, setHistory] = useState<({ x: number; y: number }[])[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  // Precision Zoom (Magnifying Glass) state
  const [isPrecisionZooming, setIsPrecisionZooming] = useState(false);
  const preZoomState = useRef({ scale: 1.0, scrollLeft: 0, scrollTop: 0 });
  const lastMouseEvent = useRef<MouseEvent | null>(null);


  // Initialize state from localStorage or use defaults
  const [scale, setScale] = useState(() => getInitialState('floorPlanScale', 1.0));
  const [rotation, setRotation] = useState(() => getInitialState('floorPlanRotation', 0));
  const [isLocked, setIsLocked] = useState(() => getInitialState('floorPlanLocked', true));
  const [statusVisibility, setStatusVisibility] = useState(() => getInitialState('floorPlanStatusVisibility', {
      'Διαθέσιμο': true,
      'Κρατημένο': true,
      'Πωλημένο': true,
      'Οικοπεδούχος': true,
  }));
  const [zoomInput, setZoomInput] = useState(`${(scale * 100).toFixed(0)}%`);

   useEffect(() => {
     setZoomInput(`${(scale * 100).toFixed(0)}%`);
   }, [scale]);

   const handleZoomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     setZoomInput(e.target.value);
   };
 
   const handleZoomInputBlur = () => {
     const newScale = parseFloat(zoomInput) / 100;
     if (!isNaN(newScale) && newScale > 0) {
       setScale(Math.max(0.05, Math.min(newScale, 10))); // clamp between 5% and 1000%
     } else {
       setZoomInput(`${(scale * 100).toFixed(0)}%`); // revert if invalid
     }
   };
 
   const handleZoomInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
     if (e.key === 'Enter') {
       handleZoomInputBlur();
       (e.target as HTMLInputElement).blur();
     } else if (e.key === 'Escape') {
        setZoomInput(`${(scale * 100).toFixed(0)}%`);
       (e.target as HTMLInputElement).blur();
     }
   };


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

  
  const resetDrawingState = useCallback(() => {
    setCurrentPolygonPoints([]);
    setMousePosition(null);
    setSnapPoint(null);
    setHistory([[]]); // Start with a single empty state
    setHistoryIndex(0);
  }, []);

  useEffect(() => {
    setPageNumber(1);
    resetDrawingState(); // Reset drawing on new PDF
  }, [pdfUrl, resetDrawingState]);


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
  
  async function onPageLoadSuccess(page: PDFPageProxy) {
    const originalViewport = page.getViewport({ scale: 1 });
  
    // Create an in-memory canvas to analyze the PDF content
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) {
        setPageDimensions({ width: originalViewport.width, height: originalViewport.height, cropBox: { x: 0, y: 0, width: originalViewport.width, height: originalViewport.height } });
        return;
    }
  
    canvas.width = originalViewport.width;
    canvas.height = originalViewport.height;
  
    const renderContext = {
      canvasContext: context,
      viewport: originalViewport,
    };
    await page.render(renderContext).promise;
  
    // Analyze the canvas to find the content bounding box
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let minX = canvas.width, minY = canvas.height, maxX = -1, maxY = -1;
  
    // Check for non-white pixels (with a tolerance for off-white)
    const isWhite = (r: number, g: number, b: number, a: number) => a === 0 || (r > 240 && g > 240 && b > 240);
  
    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const i = (y * canvas.width + x) * 4;
        if (!isWhite(data[i], data[i+1], data[i+2], data[i+3])) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }
    
    // Fallback if no content is found
    if (maxX === -1) {
        minX = 0; minY = 0; maxX = canvas.width; maxY = canvas.height;
    }
  
    const padding = 20; // Add some padding around the content
    const cropBox = {
        x: Math.max(0, minX - padding),
        y: Math.max(0, minY - padding),
        width: Math.min(canvas.width, (maxX - minX) + 2 * padding),
        height: Math.min(canvas.height, (maxY - minY) + 2 * padding),
    };
    
    setPageDimensions({ 
        width: originalViewport.width, 
        height: originalViewport.height,
        cropBox
    });
  }

  const handleUnitClick = (unitId: string) => {
    if (isEditMode || isLocked) return;
    setSelectedUnitId(unitId);
    // Don't call onUnitClick here, it will be called from the popover buttons
  };
  
  const getSvgPoint = (event: React.MouseEvent<SVGSVGElement | SVGCircleElement> | MouseEvent) => {
    if (!svgRef.current) return null;
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = event.clientX;
    pt.y = event.clientY;
    const transformedPoint = pt.matrixTransform(svg.getScreenCTM()?.inverse());
    
    return transformedPoint;
  };

  const handleSvgClick = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!isEditMode || isLocked) return;
    
    let clickPoint = getSvgPoint(event);
    if (!clickPoint) return;
    
    // Use snap point if available
    if(snapPoint) {
        clickPoint = snapPoint;
    }

    let newPoints = [...currentPolygonPoints, { x: clickPoint.x, y: clickPoint.y }];

    // Check if user is closing the polygon
    if (currentPolygonPoints.length > 1) {
        const firstPoint = currentPolygonPoints[0];
        const dx = firstPoint.x - clickPoint.x;
        const dy = firstPoint.y - clickPoint.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if(distance < CLOSING_DISTANCE_THRESHOLD / scale) {
            newPoints = currentPolygonPoints; 
            onPolygonDrawn(newPoints);
            resetDrawingState();
            setIsEditMode(false);
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
    lastMouseEvent.current = event.nativeEvent;
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
      // Snapping logic
      let bestSnapPoint = null;
      let minDistance = SNAPPING_DISTANCE_THRESHOLD / scale;
      
      // Snap to own points (for closing)
      if (currentPolygonPoints.length > 2) {
          const firstPoint = currentPolygonPoints[0];
          const d = Math.sqrt(Math.pow(firstPoint.x - svgPoint.x, 2) + Math.pow(firstPoint.y - svgPoint.y, 2));
          if (d < minDistance) {
              minDistance = d;
              bestSnapPoint = firstPoint;
          }
      }
      
      // Snap to existing units' vertices
      visibleUnits.forEach(unit => {
          unit.polygonPoints?.forEach(point => {
              const distance = Math.sqrt(Math.pow(point.x - svgPoint.x, 2) + Math.pow(point.y - svgPoint.y, 2));
              if (distance < minDistance) {
                  minDistance = distance;
                  bestSnapPoint = point;
              }
          });
      });
      setSnapPoint(bestSnapPoint);
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
    setSnapPoint(null);
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
  
  // Keyboard shortcuts (Undo, Redo, Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (!isEditMode) return;
        
        // Ignore keydowns if an input is focused
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
            return;
        }
        
        if (e.key === 'Escape') {
            e.preventDefault();
            resetDrawingState();
            toast({
                title: "Η σχεδίαση ακυρώθηκε",
                description: "Μπορείτε να ξεκινήσετε ένα νέο σχήμα.",
            });
        }
        
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
  }, [isEditMode, handleUndo, handleRedo, resetDrawingState, toast]);
  
  // Precision Zoom (Magnifying Glass) with Shift key
  useEffect(() => {
    const pdfContainer = pdfContainerRef.current;
    if (!pdfContainer) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if an input is focused or not in edit mode
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || !isEditMode) {
          return;
      }
      if (e.key === 'Shift' && !isPrecisionZooming && lastMouseEvent.current) {
        e.preventDefault();
        setIsPrecisionZooming(true);

        preZoomState.current = {
            scale: scale,
            scrollLeft: pdfContainer.scrollLeft,
            scrollTop: pdfContainer.scrollTop,
        };
        
        const rect = pdfContainer.getBoundingClientRect();
        const mouseX = lastMouseEvent.current.clientX - rect.left;
        const mouseY = lastMouseEvent.current.clientY - rect.top;

        const newScale = PRECISION_ZOOM_SCALE;
        
        // Calculate the point on the unscaled content to center on
        const pointX = (preZoomState.current.scrollLeft + mouseX) / preZoomState.current.scale;
        const pointY = (preZoomState.current.scrollTop + mouseY) / preZoomState.current.scale;

        setScale(newScale);

        // After re-render with new scale, adjust scroll to center the point
        setTimeout(() => {
            if(pdfContainerRef.current){
                const newScrollLeft = (pointX * newScale) - (pdfContainerRef.current.clientWidth / 2);
                const newScrollTop = (pointY * newScale) - (pdfContainerRef.current.clientHeight / 2);
                pdfContainerRef.current.scrollLeft = newScrollLeft;
                pdfContainerRef.current.scrollTop = newScrollTop;
            }
        }, 0);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift' && isPrecisionZooming) {
        e.preventDefault();
        setIsPrecisionZooming(false);
        setScale(preZoomState.current.scale);
        
        // Restore scroll position after re-render with old scale
        setTimeout(() => {
            if (pdfContainerRef.current) {
              pdfContainerRef.current.scrollLeft = preZoomState.current.scrollLeft;
              pdfContainerRef.current.scrollTop = preZoomState.current.scrollTop;
            }
        }, 0);
      }
    };
    
    // Update last mouse event globally for keydown handler
    const updateMousePosition = (e: MouseEvent) => {
        lastMouseEvent.current = e;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    pdfContainer.addEventListener('mousemove', updateMousePosition);


    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (pdfContainer) {
        pdfContainer.removeEventListener('mousemove', updateMousePosition);
      }
    };
  }, [isEditMode, isPrecisionZooming, scale]);


  const handleStatusVisibilityChange = (status: Unit['status'], checked: boolean) => {
      setStatusVisibility(prev => ({ ...prev, [status]: checked }));
  }

  // Effect to center content whenever scale changes or page dimensions are calculated
  useEffect(() => {
    const container = pdfContainerRef.current;
    if (container && !isPrecisionZooming) {
        // We use a small timeout to ensure the DOM has updated with the new scale
        setTimeout(() => {
            container.scrollLeft = (container.scrollWidth - container.clientWidth) / 2;
            container.scrollTop = (container.scrollHeight - container.clientHeight) / 2;
        }, 50);
    }
  }, [scale, pageDimensions, isPrecisionZooming]); 

  const handleFitToView = () => {
    const container = pdfContainerRef.current;
    if (!container || !pageDimensions || pageDimensions.cropBox.width === 0) return;
  
    const PADDING = 0.95; // 95% of view
    const { clientWidth, clientHeight } = container;
    const { width: cropWidth, height: cropHeight } = pageDimensions.cropBox;
  
    if (cropWidth <= 0 || cropHeight <= 0) return;

    const scaleX = (clientWidth / cropWidth) * PADDING;
    const scaleY = (clientHeight / cropHeight) * PADDING;
  
    const newScale = Math.min(scaleX, scaleY);
    setScale(newScale);
  };

  const visibleUnits = localUnits.filter(unit => statusVisibility[unit.status]);
  
  const loadingElement = (
    <div className="flex flex-col items-center justify-center h-full gap-4 text-muted-foreground">
      <Loader2 className="h-12 w-12 animate-spin" />
      <p>Φόρτωση και ανάλυση κάτοψης...</p>
    </div>
  );

  const drawingPolylinePoints = [...currentPolygonPoints];
  if (mousePosition && currentPolygonPoints.length > 0) {
    drawingPolylinePoints.push(snapPoint || mousePosition);
  }

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const { cropBox } = pageDimensions;
  const croppedAspectRatio = cropBox.width > 0 ? cropBox.width / cropBox.height : 1;
  
  return (
        <div className="flex flex-col gap-2 items-center">
            <div 
                ref={pdfContainerRef} 
                className="w-full bg-muted/20 border rounded-lg flex items-start justify-start"
                style={{ height: '40vh', overflow: 'auto' }}
                onMouseUp={handleMouseUp}
            >
              {pdfError ? (
                  <div className="flex items-center justify-center h-full text-destructive text-center p-4">
                  {pdfError}
                  </div>
              ) : (
                  <Document
                  file={pdfUrl}
                  onLoadSuccess={onDocumentLoadSuccess}
                  onLoadError={onDocumentLoadError}
                  loading={loadingElement}
                  className="flex justify-start"
                  >
                  <div className="relative" style={{ aspectRatio: croppedAspectRatio }}>
                      <Page 
                      pageNumber={pageNumber} 
                      scale={scale} 
                      rotate={rotation}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      onLoadSuccess={onPageLoadSuccess}
                      customTextRenderer={() => false}
                      />
                      {pageDimensions.width > 0 && (
                      <svg
                          ref={svgRef}
                          className="absolute top-0 left-0"
                          width={pageDimensions.width * scale}
                          height={pageDimensions.height * scale}
                          viewBox={`${cropBox.x} ${cropBox.y} ${cropBox.width} ${cropBox.height}`}
                          style={{ pointerEvents: 'auto', cursor: isLocked ? 'not-allowed' : isEditMode ? 'crosshair' : 'default' }}
                          onClick={handleSvgClick}
                          onMouseMove={handleMouseMove}
                          onMouseLeave={handleMouseLeave}
                      >
                           {/* Layer for crosshair guides */}
                          {isEditMode && mousePosition && (
                              <g className="pointer-events-none">
                                  <line 
                                      x1={0} y1={mousePosition.y} 
                                      x2={pageDimensions.width} y2={mousePosition.y} 
                                      stroke="hsl(var(--destructive))" 
                                      strokeWidth={0.8 / scale} 
                                      strokeDasharray={`${4/scale} ${4/scale}`} 
                                  />
                                  <line 
                                      x1={mousePosition.x} y1={0} 
                                      x2={mousePosition.x} y2={pageDimensions.height} 
                                      stroke="hsl(var(--destructive))" 
                                      strokeWidth={0.8 / scale} 
                                      strokeDasharray={`${4/scale} ${4/scale}`}
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
                                                  className={cn(
                                                      'stroke-2 transition-all',
                                                      selectedUnitId === unit.id ? 'opacity-50' : 'opacity-40 group-hover/polygon:opacity-70'
                                                  )}
                                                  style={{
                                                      fill: getStatusColor(unit.status),
                                                      stroke: getStatusColor(unit.status),
                                                      strokeWidth: 2 / scale,
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
                                          r={5 / scale}
                                          fill={getStatusColor(unit.status)}
                                          stroke="#fff"
                                          strokeWidth={1.5 / scale}
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
                                      strokeWidth={2.5 / scale}
                                      strokeDasharray={`${6/scale} ${6/scale}`}
                                  />
                                  {currentPolygonPoints.map((point, index) => (
                                      <circle
                                          key={index}
                                          cx={point.x}
                                          cy={point.y}
                                          r={4 / scale}
                                          fill={index === 0 ? "hsl(var(--destructive))" : "hsl(var(--primary))"}
                                          stroke="#fff"
                                          strokeWidth={1.5 / scale}
                                      />
                                  ))}
                              </g>
                          )}
                          
                          {/* Layer for a finalized but unsaved polygon */}
                          {drawingPolygon && drawingPolygon.length > 0 && (
                               <g className="pointer-events-none">
                                  <polygon
                                      points={drawingPolygon.map(p => `${p.x},${p.y}`).join(' ')}
                                      fill="hsla(var(--primary), 0.3)"
                                      stroke="hsl(var(--primary))"
                                      strokeWidth={2 / scale}
                                  />
                               </g>
                          )}

                          {/* Snap point indicator */}
                          {snapPoint && isEditMode && (
                              <g className="pointer-events-none">
                                  <circle cx={snapPoint.x} cy={snapPoint.y} r={SNAPPING_DISTANCE_THRESHOLD / scale} fill="none" stroke="hsl(var(--destructive))" strokeWidth={1/scale} strokeDasharray={`${2/scale} ${2/scale}`} />
                                  <circle cx={snapPoint.x} cy={snapPoint.y} r={3/scale} fill="hsl(var(--destructive))" />
                              </g>
                          )}
                      </svg>
                      )}
                  </div>
                  </Document>
              )}
          </div>
        <div className="flex flex-col items-center gap-2">
            <div className="flex flex-wrap items-center justify-center gap-2 p-2 rounded-md bg-muted">
                <Button variant="ghost" size="icon" onClick={() => setScale(s => Math.max(0.1, s - 0.1))} disabled={!numPages || isLocked}>
                    <Minus />
                </Button>
                <Input
                    value={zoomInput}
                    onChange={handleZoomInputChange}
                    onBlur={handleZoomInputBlur}
                    onKeyDown={handleZoomInputKeyDown}
                    className="w-20 text-center h-8"
                    disabled={!numPages || isLocked}
                />
                <Button variant="ghost" size="icon" onClick={() => setScale(s => Math.min(10, s + 0.1))} disabled={!numPages || isLocked}>
                    <Plus />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleFitToView} disabled={!numPages || isLocked} title="Προσαρμογή στην οθόνη">
                    <Frame />
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
             <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
                <Card className="w-full">
                    <CardContent className="p-2 text-center h-full flex items-center justify-center">
                        {isPrecisionZooming ? (
                            <p className="text-sm text-blue-700 font-medium flex items-center justify-center gap-2">
                                <ZoomIn size={16} />
                                Λειτουργία Ακρίβειας <span className="text-xs text-blue-700/80">(Αφήστε το Shift)</span>
                            </p>
                        ) : isLocked ? (
                            <p className="text-sm text-yellow-700 font-medium flex items-center justify-center gap-2">
                                Κλειδωμένη <Unlock size={12} className="inline-block" />
                            </p>
                        ) : isEditMode ? (
                            <p className="text-sm text-primary font-medium flex items-center justify-center gap-2">
                                Λειτουργία Σχεδίασης <span className="text-xs text-primary/80">(Esc για ακύρωση)</span>
                            </p>
                        ) : (
                            <p className="text-sm text-secondary-foreground font-medium">
                                Λειτουργία Επεξεργασίας: Σύρετε τα σημεία για να αλλάξετε το σχήμα.
                            </p>
                        )}
                    </CardContent>
                </Card>

                <Card className="w-full">
                    <CardContent className="p-2 h-full flex items-center">
                        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 w-full">
                            <h4 className="text-sm font-medium leading-none whitespace-nowrap">Εμφάνιση Layers:</h4>
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
        </div>
        </div>
  );

}
